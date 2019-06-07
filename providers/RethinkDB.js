const DatabaseProvider = require('../classes/DatabaseProvider');

module.exports = class RethinkDB extends DatabaseProvider {
    constructor(options) {
        super('RethinkDB');

        const r = require('rethinkdbdash');

        this.db = r({ host: options.host, port: options.port, db: options.db });
        this.persistent = true;
    }

    async set(key, value, table = null) {
        if (!table) return false;

        const data = value;
        data.id = key;

        await this.db.table(table).insert(data);
        return value;
    }

    async has(key, table = null) {
        if (!table) return false;

        const item = await this.db.table(table).get(key);

        if (item) {
            return true;
        } else {
            return false;
        }
    }

    async update(key, value, table = null) {
        if (!table) return false;

        const item = await this.db.table(table).get(key);

        if (item) {
            await this.db.table(table).get(key).update(value);
            return value;
        } else {
            return null;
        }
    }

    async delete(key, table = null) {
        if (!table) return false;

        const item = await this.db.table(table).get(key);

        if (item) {
            await this.db.table(table).get(key).update(value);
            return null;
        } else {
            return false;
        }
    }

    async get(key, table = null) {
        if (!table) return false;

        const item = await this.db.table(table).get(key);

        if (item) {
            return item;
        } else {
            return null;
        }
    }

    async find(func = null, table = null) {
        if (!func || typeof (func) != 'function') return false;
        if (!table) return false;

        const items = await this.db.table(table);
        const value = items.find(func);

        if (value) {
            return value;
        } else {
            return null;
        }
    }
}