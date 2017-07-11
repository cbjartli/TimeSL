class InputStream {
    constructor(input) {
        this._input = input;
        this._length = input.length;
        this._cursor = 0;
    }

    peek() {
        return this._input[this._cursor];
    }

    next() {
        return this._input[this._cursor++];
    }

    eof() {
        return this._cursor == this._length;
    }

    err(msg) {
        throw new Error(msg);
    }
}

module.exports = InputStream;

