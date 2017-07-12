class InputStream {
    constructor(input) {
        this._input = input.split(/[\s\t]+/).map(w => w.toLowerCase());
        this._cursor = 0;
    }

    peek() {
        return this._input[this._cursor];
    }

    next() {
        return this._input[this._cursor++];
    }

    eof() {
        return this._cursor == this._input.length;
    }

    err(msg) {
        throw new Error(`${msg} (pos ${this._cursor})`);
    }
}

module.exports = InputStream;

