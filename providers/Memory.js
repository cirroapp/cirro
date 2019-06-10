const DatabaseProvider = require('../classes/DatabaseProvider');

module.exports = class Memory extends DatabaseProvider {
    constructor() {
        super('Memory');

        // delete all comments
        
        // 'table = null' means that if you need to define a table
        // in your request, it's there, otherwise it doesn't have
        // to be used

        this.db = new Map(); // this is where you'd set the db/make it
        this.persistent = false;
    }

    async set(key, value, table = null) {
        this.db.set(key, value);
        return value;
    }

    async has(key, table = null) {
        if (this.db.has(key)) {
            return true;
        } else {
            return false;
        }
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