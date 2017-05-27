import SParse from 's-expression'
import md5 from 'md5'
import { isString } from 'lodash'
import * as path from 'path'

export const pathToId = md5


const stripComments = text => text.replace(/^\s*;;.*$/gm, '')
// SParse.SyntaxError is just an alias for Error, unfortunately
export const SyntaxError = SParse.SyntaxError
export class ParseError extends Error { }
export class TitleNotAStringError extends ParseError {
    constructor(input) {
        super('title must be a string, was: ' + JSON.stringify(input))
    }
}
export class TitleNotAtTopLevelError extends ParseError {
    constructor() {
        super('title is only allowed at the top level')
    }
}
export class OptsNotFoundError extends ParseError {
    constructor(type) { super(`missing options for a ${type}`) }
}
export class NameNotFoundError extends ParseError {
    constructor(type) { super(`missing a name for a ${type}`) }
}

export class InvalidDirectionError extends ParseError {
    constructor(dir) { super(`Unknown edge direction "${dir}". valid options are "push", "pull", or "both"`) }
}

const keywordAliases = [
    { from: /^:desc.*/i, to: 'description' },
    { from: /^:to/i, to: 'to' },
    { from: /^:tech/i, to: 'tech' },
    { from: /^:dir.*/i, to: 'direction' }
]

function canonicalize(key) {
    return keywordAliases
        .filter(({ from }) => from.test(key))
        .map(({ to }) => to)[0] || key;
}

function parseKeywordArgs(kwargs, allowed = /.*/) {
    if (kwargs.length === 0) return {};

    const [keyword, value, ...rest] = kwargs;
    const key = canonicalize(keyword);

    return Object.assign(
        allowed.test(key) ? { [key]: value.toString() } : {},
        parseKeywordArgs(rest, allowed));
}

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
        type = type.replace(/^def(ine)?-/i, '')
        const node = type in this
            ? this[type](rest, parent)
            : this.item(rest, parent, type);

        if (!node) return;

        if (/system|container/i.test(type)
            && node.children.some(x => x.type !== 'edge')) {
            node.canExpand = true
        }
        return Object.assign(node, { type: type.toLowerCase() });
    }

    item([opts, ...children], parent, type) {
        if (!opts) { throw new OptsNotFoundError(type) }
        const [name, ...kwargs] = opts
        if (!name) { throw new NameNotFoundError(type) }
        const path = this.pathToNode(name, parent).toString()
        const node = {
            name: name.toString(),
            id: pathToId(path),
            path
        }
        if (parent) node.parentId = parent.id
        this.idMap[node.id] = node
        this.pathMap[node.path] = node.id
        Object.assign(node, parseKeywordArgs(kwargs, /description|tech/))
        this.items.push(node)
        node.children = this.buildIR(children, node)
        return node;
    }

    edge(input, parent) {
        const edge = Object.assign(
            { sourceId: parent.id },
            parseKeywordArgs(input, /description|to|tech|direction/))
        this.edges.push(edge)
        return edge
    }

    title([input], parent) {
        if (!isString(input)) { throw new TitleNotAStringError(input) }
        if (parent) { throw new TitleNotAtTopLevelError() }
        this.graphTitle = input.toString();
    }

    pathToNode(name, parent) {
        return parent
            ? this.idMap[parent.id].path + '/' + name
            : name
    }

    postProcessEdge(edge) {
        if (edge.to.startsWith('.')) {
            const src = this.idMap[edge.sourceId]
            const parent = this.idMap[src.parentId]
            edge.to = path.join(parent.path, edge.to)
        }

        edge.destinationId = this.pathMap[edge.to]

        if (!edge.destinationId) {
            throw new ParseError(`Could not find node '${edge.to}'`)
        }
        if (edge.sourceId === edge.destinationId) {
            throw new ParseError(`Edge cannot be both from and to '${edge.to}'`)
        }
        if (edge.direction) {
            if (/^(push|pull|both)$/i.test(edge.direction)) {
                edge.direction = edge.direction.toLowerCase()
            } else {
                throw new InvalidDirectionError(edge.direction)
            }
        }

        edge.id = pathToId(edge.sourceId + edge.destinationId)
        edge.sourceParentIds = this.findParentIds(edge.sourceId)
        edge.destinationParentIds = this.findParentIds(edge.destinationId)
    }

    findParentIds(id) {
        const node = this.idMap[id];
        if (!node.parentId) return [];

        return [node.parentId]
            .concat(this.findParentIds(node.parentId))
    }
}

export const parse = text => new Parser().parse(text)



/*
TODO: detect errors:

* duplicate paths

*/