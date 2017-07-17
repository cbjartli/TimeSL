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
                if ("$val" in lookupset[word]) {
                    tokens.push({type: 'kw', val: lookupset[word].$val});
                    lookupset = keywords;
                } else {
                    lookupset = lookupset[word];
                }
            } else if (word.match(/^[0-9]+(st|nd|rd|th)$/)) {
                tokens.push({type: 'ord', val: parseInt(word.substring(0, word.length - 2)) });
            } else if (word.match(/^[0-9]+$/)) {
                tokens.push({type: 'int', val: parseInt(word)});
            } else if (word.match(/^{[a-zA-Z0-9]+}$/)) {
                tokens.push({type: 'var', val: word.substring(1, word.length - 1)});
            } else if (word == '') {
            } else {
                wordstream.err("Unable to tokenize @ " + word)
            }
        }
    
        return tokens;
    }
}

module.exports = Tokenizer;

