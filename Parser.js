let Tokenizer = require('./Tokenizer.js');

class Parser {
    constructor(input) {
        this.tokens = Tokenizer(input);
        this.ast = null;

        this.parseExpr: Parser.production('expr', [this.parseDate]) 
        this.parseDate: Parser.production('date', [this.parseDate7, this.parseDate6, this.parseDate5, this.parseDate4, this.parseDate3, this.parseDate2, this.parseDate1])
        this.parseDate1: Parser.production('date1', [Parser.parseIndefdate])
    }

    static evaluateProductions(productions) {
        let parser;

        while (parser = productions.pop()) {
            let child;
            if (child = parser()) {
                return child;
            } 
        }
        return null;
    }

    static production(type, productions) {
        return function() {
            let astnode = {type: type, children: []};
            let child = Parser.evaluateProductions(productions) 
            if (child) {
                astnode.children.push(child);
                return astnode;
            } 
            return null;
        }
    }

    parse() {
        this.ast = Parser.parseExpr(this.tokens);
        return this.ast;
    }



}
