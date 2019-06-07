const DatabaseProvider = require('../classes/DatabaseProvider');

module.exports = class Memory extends DatabaseProvider {
    constructor() {
        super('memory');

        this.db = new Map();
        this.persistent = false;
    }

    async set(key, value) {
        this.db.set(key, value);
        return value;
    }

    async delete(key) {
        if (this.db.has(key)) {
            this.db.delete(key);
            return true;
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