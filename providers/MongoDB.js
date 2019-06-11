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
            if (error) {
                throw error;
            }  else {
                this.db = client.db(options.db);
            }
        });

    }

    async set(key, value, table = null) {
        if (!table) return false;

        const data = value;
        data._id = key;

        await this.db.collection(table).insertOne(data);
        return value;
    }

    async has(key, table = null) {
        if (!table) return false;

        const item = await this.db.collection(table).findOne({ _id: key });

        if (item) {
            return true;
        } else {
            return false;
        }
    }

    async count(table = null) {
        if (!table) return false;

        const items = await this.db.collection(table);

        return items.length;
    }
    
    async all(table = null) {
        return !table ? false : await this.db.collection(table).toArray();
    }

    async update(key, value, table = null) {
        if (!table) return false;

        const item = await this.db.collection(table).findOne({ _id: key });

        if (item) {
            await this.db.collection(table).updateOne({ _id: key }, { $set: value });
            return value;
        } else {
            return null;
        }
    }

    async delete(key, table = null) {
        if (!table) return false;

        const item = await this.db.collection(table).findOne({ _id: key });

        if (item) {
            await this.db.collection(table).remove({ _id: key });
            return null;
        } else {
            return false;
        }
    }

    async get(key, table = null) {
        if (!table) return false;

        const item = await this.db.collection(table).findOne({ _id: key });

        if (item) {
            return item;
        } else {
            return null;
        }
    }

    async find(func = null, table = null) {
        if (!func || typeof (func) != 'function') return false;
        if (!table) return false;

        const items = await this.db.collection(table).find({}).toArray();
        const value = items.find(func);

        if (value) {
            return value;
        } else {
            return null;
        }
    }
}
