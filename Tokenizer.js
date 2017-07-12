const InputStream = require('./InputStream.js');
const GenerateKeywords = require('./Keywords.js');


class Tokenizer {
    constructor(input) {
        this._tokens = Tokenizer.tokenize(input);
    }

    static tokenize(input) {
        let keywords = GenerateKeywords();
        let wordstream = new InputStream(input);
        let lookupset = keywords;
        let tokens = [];
    
        while (!wordstream.eof()) {
            let word = wordstream.next();
    
            if (word in lookupset) {
                if ("$type" in lookupset[word]) {
                    tokens.push({type: lookupset[word].$type, val: lookupset[word].$val});
                    lookupset = keywords;
                } else {
                    lookupset = lookupset[word];
                }
            } else if (word.match(/[0-9]+/)) {
                tokens.push({type: "int", val: parseInt(word)})
            } else {
                wordstream.err("Unable to tokenize")
            }
        }
    
        return tokens;
    }
}

module.exports = Tokenizer;

