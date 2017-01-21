import SParse from 's-expression'
import md5 from 'md5'
import { isString } from 'lodash'

export const pathToId = md5


const stripComments = text => text.replace(/^\s*;;.*$/gm, '')
export class ParseError extends Error {}
class Parser {

    constructor() {
        this.idMap = {}
        this.pathMap = {}
        this.edges = []
        this.items = []
    }

    parse(text) {
        const tokens = SParse('(' + stripComments(text) + ')')
        if (tokens instanceof SParse.SyntaxError) {
            throw tokens
        }
        this.buildIR(tokens)
        for (const e of this.edges) {
            this.postProcessEdge(e)
        }

        return {
            title: this.graphTitle,
            edges: this.edges,
            items: this.items,
            roots: this.items
                .filter(x => !x.parentId)
                .map(x => x.id),
            idMap: this.idMap,
            pathMap: this.pathMap
        }
    }

    buildIR(tokens, parent) {
        return tokens.map(x => this.buildIRNode(x, parent))
    }

    buildIRNode([type, ...rest], parent) {

        const node = type in this
            ? this[type](rest, parent)
            : this.item(rest, parent);

        if(!node) return;

        if (/system|container/i.test(type)
            && node.children.some(x => x.type !== 'edge')) {
            node.canExpand = true
        }

        return Object.assign(node, { type: type.toLowerCase() });
    }

    item([opts, ...children], parent) {
        const [name, ...kwargs] = opts
        const path = this.pathToNode(name, parent).toString()
        const node = {
            name: name.toString(),
            id: pathToId(path),
            path
        }
        if (parent) node.parentId = parent.id
        this.idMap[node.id] = node
        this.pathMap[node.path] = node.id
        Object.assign(node, this.parseKeywordArgs(kwargs, /description|tech/))
        this.items.push(node)
        node.children = this.buildIR(children, node)
        return node;
    }

    edge(input, parent) {
        const edge = Object.assign(
            { sourceId: parent.id },
            this.parseKeywordArgs(input, /description|to|tech/))
        this.edges.push(edge)
        return edge
    }

    title([input], parent){
        if(!isString(input)) throw new ParseError('title must be a string, was' + JSON.stringify(input))
        if(parent) throw new ParseError('title is only allowed at the top level')
        this.graphTitle = input.toString();
    }

    pathToNode(name, parent) {
        return parent
            ? this.idMap[parent.id].path + '/' + name
            : name
    }

    parseKeywordArgs(kwargs, allowed = /.*/) {
        if (kwargs.length === 0) return {};

        const [keyword, value, ...rest] = kwargs;
        const key = keyword.substring(1).toLowerCase();

        return Object.assign(
            allowed.test(key) ? { [key]: value.toString() } : {},
            this.parseKeywordArgs(rest, allowed));
    }

    postProcessEdge(edge) {
        edge.destinationId = this.pathMap[edge.to]
        edge.id = pathToId(edge.sourceId + edge.destinationId)
        edge.sourceParentIds = this.findParentIds(edge.sourceId)
        edge.destinationParentIds = this.findParentIds(edge.destinationId)
    }

    findParentIds(id){
        const node = this.idMap[id];
        if(! node.parentId) return [];

        return [node.parentId]
            .concat(this.findParentIds(node.parentId))
    }
}

export const parse = text => new Parser().parse(text)
export const SyntaxError = SParse.SyntaxError



/*
TODO: detect errors:

* duplicate paths
* self-edges
* edge to nowhere

*/