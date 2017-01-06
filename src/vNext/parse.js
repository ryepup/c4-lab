import tokenize from 's-expression'
import uuid from 'uuid'

export class Parser {

    constructor() {
        this.idMap = {}
    }

    parse(text) {
        return this.parseAll(tokenize('(' + text + ')'));
    }

    parseAll(tokens, parent) {
        return tokens.map(x => this.parseToken(x, parent))
    }

    parseToken([type, ...rest], parent) {

        const item = type in this
            ? this[type](rest, parent)
            : this.item(rest, parent);

        return Object.assign(item, { type: type.toLowerCase() });

    }

    item([opts, ...children], parent) {
        const [name, ...kwargs] = opts
        const item = {
            name,
            options: this.parseKeywordArgs(kwargs),
            id: uuid.v4()
        }
        item.children = this.parseAll(children, item);
        return item;
    }

    edge(input, parent) {
        return Object.assign({ from: parent.id, id: uuid.v4() }, this.parseKeywordArgs(input))
    }

    parseKeywordArgs(kwargs) {
        if (kwargs.length === 0) return {};

        const [keyword, value, ...rest] = kwargs;

        return Object.assign({}, {
            [keyword.substring(1).toLowerCase()]: value
        }, this.parseKeywordArgs(rest));
    }
}

export const parse = text => new Parser().parse(text);