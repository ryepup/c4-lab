import tokenize from 's-expression'
import uuid from 'uuid'


// TODO: DEAR GOD TESTS
class Parser {

    constructor() {
        this.idMap = {}
        this.pathMap = {}
        this.edges = []
        this.items = []
    }

    parse(text) {
        this.buildIR(tokenize('(' + text + ')'));
        this.edges.map(e => e.destinationId = this.pathMap[e.to].id)
        return { edges: this.edges, items: this.items }
    }

    buildIR(tokens, parent) {
        return tokens.map(x => this.buildIRNode(x, parent))
    }

    buildIRNode([type, ...rest], parent) {

        const node = type in this
            ? this[type](rest, parent)
            : this.item(rest, parent);

        return Object.assign(node, { type: type.toLowerCase() });

    }

    item([opts, ...children], parent) {
        const [name, ...kwargs] = opts
        const node = {
            name,
            id: uuid.v4(),
            parentId: parent && parent.id
        }
        node.path = this.pathToNode(node)
        this.idMap[node.id] = this.pathMap[node.path] = node
        Object.assign(node, this.parseKeywordArgs(kwargs, /description|tech/))
        this.items.push(node)
        this.buildIR(children, node)
        return node;
    }

    edge(input, parent) {
        const edge = Object.assign(
            { sourceId: parent.id, id: uuid.v4() },
            this.parseKeywordArgs(input, /description|to|tech/))
        this.edges.push(edge)
        return edge
    }

    pathToNode(node) {
        return node.parentId
            ? this.idMap[node.parentId].path + '/' + node.name
            : node.name
    }

    parseKeywordArgs(kwargs, allowed = /.*/) {
        if (kwargs.length === 0) return {};

        const [keyword, value, ...rest] = kwargs;
        const key = keyword.substring(1).toLowerCase();

        return Object.assign(
            allowed.test(key) ? { [key]: value } : {},
            this.parseKeywordArgs(rest, allowed));
    }
}

export const parse = text => new Parser().parse(text);