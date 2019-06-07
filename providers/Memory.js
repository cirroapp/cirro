const DatabaseProvider = require('../src/classes/DatabaseProvider');

module.exports = class Memory extends DatabaseProvider {
    constructor() {
        super('Memory');

        this.db = new Map(); // this is where you'd set the db/make it
        this.persistent = false;
    }

    async set(key, value, table = null) {
        this.db.set(key, value);
        return value;
    }

    async update(key, value, table = null) {
        if (this.db.has(key)) {
            this.db.set(key, value);
            return value;
        } else {
            return null;
        }
    }

    async delete(key, table = null) {
        if (this.db.has(key)) {
            this.db.delete(key);
            return null;
        } else {
            return false;
        }
    }

    async get(key, table = null) {
        if (this.db.has(key)) {
            return this.db.get(key);
        } else {
            return null;
        }
    }

    async find(func = null, table = null) {
        if (!func || typeof (func) != 'function') return false;
        
        const value = this.db.find(func);

        if (value) {
            return value;
        } else {
            return null;
        }
    }
}