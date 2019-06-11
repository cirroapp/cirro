const DatabaseProvider = require('../classes/DatabaseProvider');

module.exports = class MongoDB extends DatabaseProvider {
    constructor(options) {
        super('MongoDB');

        const MongoClient = require('mongodb').MongoClient;
        this.db = null;
        MongoClient.connect(options.url, { useNewUrlParser: true }, (error, client) => {
            if (error) throw error;
            this.db = client.db(options.db);
        });
        this.persistent = true;
    }

    async set(key, value, collection = null) {
        if (!collection) return false;

        const data = value;
        data._id = key;

        await this.db.collection(collection).insertOne(data);
        return value;
    }

    async has(key, collection = null) {
        if (!collection) return false;

        const item = await this.db.collection(collection).findOne({ _id: key });

        if (item) {
            return true;
        } else {
            return false;
        }
    }

    async count(collection = null) {
        if (!collection) return false;

        const items = await this.db.collection(collection);

        return items.length;
    }

    async update(key, value, collection = null) {
        if (!collection) return false;

        const item = await this.db.collection(collection).findOne({ _id: key });

        if (item) {
            await this.db.collection(collection).updateOne({ _id: key }, { $set: value });
            return value;
        } else {
            return null;
        }
    }

    async delete(key, collection = null) {
        if (!collection) return false;

        const item = await this.db.collection(collection).findOne({ _id: key })

        if (item) {
            await this.db.collection(collection).remove({ _id: key });
            return null;
        } else {
            return false;
        }
    }

    async get(key, collection = null) {
        if (!collection) return false;

        const item = await this.db.collection(collection).findOne({ _id: key });

        if (item) {
            return item;
        } else {
            return null;
        }
    }

    async find(func = null, collection = null) {
        if (!func || typeof (func) != 'function') return false;
        if (!collection) return false;

        const items = await this.db.collection(collection).find({}).toArray();
        const value = items.find(func);

        if (value) {
            return value;
        } else {
            return null;
        }
    }
}
