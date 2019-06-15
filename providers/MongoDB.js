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
        return (!key || !value || !table) ? false : await this.db.collection(table).insertOne({ id: key, ...value }).then(() => value);
    }

    async has(key, table = null) {
        return (!key || !table) ? false : !!(await this.db.collection(table).findOne({ id: key }));
    }

    async count(table = null) {
        return !table ? false : (await this.db.collection(table).find().toArray()).length;
    }
    
    async all(table = null) {
        return !table ? false : await this.db.collection(table).find().toArray();
    }

    async update(key, value, table = null) {
        if (!table) return false;
        const item = await this.db.collection(table).findOne({ id: key });
        return !item ? false : await this.db.collection(table).updateOne({ id: key }, { $set: value });
    }

    async delete(key, table = null) {
        if (!table) return false;
        return (await this.db.collection(table).deleteOne({ id: key })).result.n === 1;
    }

    async get(key, table = null) {
        return !table ? false : await this.db.collection(table).findOne({ id: key });
    }

    async find(func = null, table = null) {
        return (!func || typeof func != 'function' || !table) ? false : (await this.db.collection(table).find().toArray()).find(func);
    }

    async bulkUpdate(data, table = null) {
        return !table ? false : await this.db.collection(table).bulkWrite(data.map(d => ({
            updateOne: {
                filter: { id: d.id },
                update: d,
                upsert: false
            }
        })));
    }
}
