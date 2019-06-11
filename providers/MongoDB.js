const DatabaseProvider = require('../classes/DatabaseProvider');

module.exports = class MongoDB extends DatabaseProvider {
    constructor(options) {
        super('MongoDB');

        const { MongoClient } = require('mongodb');

        this.db = null;
        this.persistent = true;

        MongoClient.connect(options.url, {
            useNewUrlParser: true
        }, (error, client) => {
            if (error) throw error;
            this.db = client.db(options.db);
        });

    }

    async set(key, value, table = null) {
        return (!key || !value || !table) ? false : await this.db.collection(table).insertOne(data).then(() => value);
    }

    async has(key, table = null) {
        return (!key || !table) ? false : !!(await this.db.collection(table).findOne({ _id: key }));
    }

    async count(table = null) {
        return !table ? false : (await this.db.collection(table).toArray()).length;
    }
    
    async all(table = null) {
        return !table ? false : await this.db.collection(table).toArray();
    }

    async update(key, value, table = null) {
        if (!table) return false;
        const item = await this.db.collection(table).findOne({ _id: key });
        return !item ? false : await this.db.collection(table).updateOne({ _id: key }, { $set: value });
    }

    async delete(key, table = null) {
        if (!table) return false;
        return (await this.db.collection(table).remove({ _id: key })).result.nRemoved >= 1;
    }

    async get(key, table = null) {
        return !table ? false : await this.db.collection(table).findOne({ _id: key });
    }

    async find(func = null, table = null) {
        return (!func || typeof func != 'function' || !table) ? false : (await this.db.collection(table).find({}).toArray()).find(func);
    }

}
