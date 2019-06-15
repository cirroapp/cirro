const DatabaseProvider = require('../classes/DatabaseProvider');

module.exports = class RethinkDB extends DatabaseProvider {
    constructor(options) {
        super('RethinkDB');

        const r = require('rethinkdbdash');

        this.db = r({ host: options.host, port: options.port, db: options.db });
        this.persistent = true;
    }

    async set(key, value, table = null) {
        return !table ? false : await this.db.table(table).insert({ id: key, ...value }).then(() => value);
    }

    async has(key, table = null) {
        return !table ? false : !!(await this.db.table(table).get(key));
    }

    async count(table = null) {
        return !table ? false : (await this.db.table(table)).length;
    }

    async all(table = null) {
        if (!table) return false;

        const items = await this.db.table(table);

        return items;
    }

    async update(key, value, table = null) {
        if (!table) return false;
        const item = await this.db.table(table).get(key);
        return !item ? null : await this.db.table(table).get(key).update(value).then(() => value);
    }

    async delete(key, table = null) {
        if (!table) return false;
        const item = await this.db.table(table).get(key);
        return !item ? null : await this.db.table(table).get(key).delete().then(() => true);
    }

    async get(key, table = null) {
        return !table ? false : await this.db.table(table).get(key);
    }

    async find(func = null, table = null) {
        return (!func || typeof func != 'function' || !table) ? false : (await this.db.table(table)).find(func);
    }

    async bulkUpdate(data, table = null) {
        return !table ? false : data.forEach(d => {
            await this.db.table(table).get(d.id).update(d);
        });
    }
}