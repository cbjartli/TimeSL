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
        let astnode = {type: 'date', children: []};
        let child;
        this.tokens.saveCursor();
        if ((child = this.parseDate1()) || (child = this.parseDate2()))  {
            this.tokens.discardCursor();
            astnode.children.push(child);
            return astnode;
        }

        this.tokens.rewindCursor();
        return null;
    }

    // <indefdate> <year>
    parseDate1() {
        let astnode = {type: 'date1', children: []};
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
        let astnode = {type: 'date2', children: []};
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

    parseIndefdate() {
        let astnode = {type: 'indefdate', children: []};
        let child;
        this.tokens.saveCursor();
        if (child = this.parseIndefdate1()) {
            this.tokens.discardCursor();
            astnode.children.push(child);
            return astnode;
        }
        this.tokens.rewindCursor();
        return null;
    }

    // <month> <daynum>
    parseIndefdate1() {
        let astnode = {type: 'indefdate1', children: []};
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
        let astnode = {type: 'year', children: []};
        let child;
        this.tokens.saveCursor();
        if ((child = this.parseYear1()) 
            || (child = this.parseYear2()) 
            || (child = this.parseYear3())) {
            this.tokens.discardCursor();
            astnode.children.push(child);
            return astnode;
        }
        this.tokens.rewindCursor();
        return null;
    }

    // <int> 'bc' || <int> 'ac' || ...
    parseYear1() {
        let astnode = {type: 'year1', children: []};
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
        let astnode = {type: 'year2', children: []};
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
        let astnode = {type: 'year3', children: []};
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
}

module.exports = Parser;
