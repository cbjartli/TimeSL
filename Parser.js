let Tokenizer = require('./Tokenizer.js');

class Parser {
    constructor(input) {
        this.tokens = new Tokenizer(input);
        this.ast = null;
    }

    parse() {
        let ast = this.parseExp();
        if (!ast || !this.tokens.eof()) {
            throw new Error('Unable to parse input');
        }
        this.ast = ast;
        return ast;
    }

    parseExp() {
        let astnode = {type: 'expr', children: []};
        let child;
        this.tokens.saveCursor();
        if (child = this.parseDate()) {
            this.tokens.discardCursor();
            astnode.children.push(child);
            return astnode;
        }
        this.tokens.rewindCursor();
        return null;
    }

    parseDate() {
        let astnode;
        this.tokens.saveCursor();
        if (
            (astnode = this.parseDate1()) 
            || (astnode = this.parseDate2())
            || (astnode = this.parseDate3())
            || (astnode = this.parseDate4())
        ) {
            return astnode;
        }
        return null;
    }

    // <indefdate> <year>
    parseDate1() {
        let astnode = {type: 'date', prod: 1, children: []};
        let child1, child2;
        this.tokens.saveCursor();
        if ((child1 = this.parseIndefdate()) 
            && (child2 = this.parseYear())) {
            this.tokens.discardCursor();
            astnode.children.push(child1);
            astnode.children.push(child2);
            return astnode;
        }
        this.tokens.rewindCursor();
        return null;
    }

    // <indefdate>
    parseDate2() {
        let astnode = {type: 'date', prod: 2, children: []};
        let child;
        this.tokens.saveCursor();
        if (child = this.parseIndefdate()) {
            this.tokens.discardCursor();
            astnode.children.push(child);
            return astnode;
        }
        this.tokens.rewindCursor();
        return null;
    }

    // <seqmod> <indefdate>
    parseDate3() {
        let astnode = {type: 'date', prod: 3, children: []};
        let child1, child2;
        this.tokens.saveCursor();
        if ((child1 = this.parseIndefdate()) && (child2 = this.parseIndefdate())) {
            this.tokens.discardCursor();
            astnode.children.push(child1);
            astnode.children.push(child2);
            return astnode;
        }
        this.tokens.rewindCursor();
        return null;
    }

    // <int> <delta> <date>
    parseDate4() {
        let astnode = {type: 'date', prod: 4, children: []};
        let child1, child2, child3;
        this.tokens.saveCursor();
        if ((child1 = this.parseInt()) 
            && (child2 = this.parseDelta()) 
            && (child3 = this.parseDate())) {
            this.tokens.discardCursor();
            astnode.children.push(child1);
            astnode.children.push(child2);
            astnode.children.push(child3);
            return astnode;
        }
        this.tokens.rewindCursor();
        return null;
    }

    parseIndefdate() {
        let astnode;
        if (astnode = this.parseIndefdate1()) {
            return astnode;
        }
        return null;
    }

    // <month> <daynum>
    parseIndefdate1() {
        let astnode = {type: 'indefdate', prod: 1, children: []};
        let child1, child2;
        this.tokens.saveCursor();
        if ((child1 = this.parseMonth())
            && (child2 = this.parseDaynum())) {
            this.tokens.discardCursor();
            astnode.children.push(child1);
            astnode.children.push(child2);
            return astnode;
        }
        this.tokens.rewindCursor();
        return null;
    }
    
    parseMonth() {
        let astnode = {type: 'month', children: []};
        let child;
        this.tokens.saveCursor();
        let token = this.tokens.next();

        if (token.type == 'kw' && 
            (token.val == 'january'
            || token.val == 'february'
            || token.val == 'march'
            || token.val == 'april' 
            || token.val == 'may'
            || token.val == 'june'
            || token.val == 'july'
            || token.val == 'august'
            || token.val == 'september'
            || token.val == 'october'
            || token.val == 'november'
            || token.val == 'december')) {
            this.tokens.discardCursor();
            astnode.children.push(token);
            return astnode;
        }

        if (token.type == 'var') {
            this.tokens.discardCursor();
            astnode.children.push(token);
            return astnode;
        }

        this.tokens.rewindCursor();
        return null;
    }

    parseDaynum() {
        let astnode = {type: 'daynum', children: []};
        let child;
        this.tokens.saveCursor();
        let token = this.tokens.next();

        if (token.type == 'int' || token.type == 'var') {
            this.tokens.discardCursor();
            astnode.children.push(token);
            return astnode;
        }

        this.tokens.rewindCursor();
        return null;
    }

    parseYear() {
        let astnode;
        if ((astnode = this.parseYear1()) 
            || (astnode = this.parseYear2()) 
            || (astnode = this.parseYear3())) {
            return astnode;
        }
        return null;
    }

    // <int> 'bc' || <int> 'ac' || ...
    parseYear1() {
        let astnode = {type: 'year', prod: 1, children: []};
        this.tokens.saveCursor();
        let token1 = this.tokens.next();
        let token2 = this.tokens.next();

        if (token1.type == 'int' && token2.type == 'kw' && 
            (token2.val == 'bc' || token2.val == 'ad' || token2.val == 'bce' || token2.val == 'ce')) {
            this.tokens.discardCursor();
            astnode.children.push(token1);
            astnode.children.push(token2);
            return astnode;
        }

        this.tokens.rewindCursor();
        return null;
    }

    // <int>
    parseYear2() {
        let astnode = {type: 'year', prod: 2, children: []};
        this.tokens.saveCursor();
        let token = this.tokens.next();

        if (token.type == 'int') {
            this.tokens.discardCursor();
            astnode.children.push(token);
            return astnode;
        }

        this.tokens.rewindCursor();
        return null;
    }

    // <var>
    parseYear3() {
        let astnode = {type: 'year', prod: 3, children: []};
        let child;
        this.tokens.saveCursor();
        let token = this.tokens.next();

        if (token.type == 'var') {
            this.tokens.discardCursor();
            astnode.children.push(token);
            return astnode;
        }

        this.tokens.rewindCursor();
        return null;
    }

    parseSeqmod() {
        let astnode = {type: 'seqmod', children: []};
        let child;
        this.tokens.saveCursor();
        let token = this.tokens.next();

        if ((token.type == 'var') 
            && ((token.val == 'next')  
               || (token.val == 'last') 
               || (token.val == 'this'))) {
            this.tokens.discardCursor();
            astnode.children.push(token);
            return astnode;
        }

        this.tokens.rewindCursor();
        return null;
    }

    parseDelta() {
        let astnode = {type: 'delta', children: []};
        this.tokens.saveCursor();
        let token1 = this.tokens.next();
        let token2 = this.tokens.next();

        if ((token1.type == 'kw') 
            && (token2.type == 'kw')
            && (token1.val == 'day' || token1.val == 'days')
            && (token2.val == 'before' || token2.val == 'after')) {
            this.tokens.discardCursor();
            astnode.children.push(token1);
            astnode.children.push(token2);
            return astnode;
        }

        this.tokens.rewindCursor();
        return null;
    }

    parseInt() {
        this.tokens.saveCursor();
        let token = this.tokens.next();
        if (token.type == 'int') {
            this.tokens.discardCursor();
            return token;
        }
        this.tokens.rewindCursor();
        return null;
    }
}

module.exports = Parser;
