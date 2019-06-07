const DatabaseProvider = require('../classes/DatabaseProvider');

module.exports = class Memory extends DatabaseProvider {
    constructor() {
        super('Memory');

        this.db = new Map(); // this is where you'd set the db/make it
        this.persistent = false;
    }

    async set(key, value) {
        this.db.set(key, value);
        return value;
    }

    async update(key, value) {
        if (this.db.has(key)) {
            this.db.set(key, value);
            return value;
        } else {
            return null;
        }
    }

    async delete(key) {
        if (this.db.has(key)) {
            this.db.delete(key);
            return null;
        } else {
            return false;
        }
    }

    async get(key) {
        if (this.db.has(key)) {
            return this.db.get(key);
        } else {
            return null;
        }
    }

    async find(func = null) {
        if (!func || typeof (func) != 'function') return false;
        
        const value = this.db.find(func);

        if (value) {
            return value;
        } else {
            return null;
        }
    }
}