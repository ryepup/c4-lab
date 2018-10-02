import * as path from 'path'
import * as sexp from 'sexpr-plus'
import { Md5 } from 'ts-md5/dist/md5'

import { IEdge, IGraph, INode, isEdge, NodeId } from '../interfaces'

import InvalidDirectionError from './InvalidDirectionError'
import NameNotFoundError from './NameNotFoundError'
import OptsNotFoundError from './OptsNotFoundError'
import ParseError from './ParseError'
import TitleNotAStringError from './TitleNotAStringError'
import TitleNotAtTopLevelError from './TitleNotAtTopLevelError'

export const pathToId = (p: string) => Md5.hashStr(p, false) as string

function isString(x: sexp.Item): x is sexp.String {
    return x && x.type === 'string'
}

function isList(x: sexp.Item): x is sexp.List {
    return x && x.type === 'list'
}

function isAtom(x: sexp.Item): x is sexp.Atom {
    return x && x.type === 'atom'
}

const stripComments = (text: string) => text.replace(/^\s*;;.*$/gm, '')

const keywordAliases = [
    { from: /^:desc.*/i, to: 'description' },
    { from: /^:to/i, to: 'to' },
    { from: /^:tech/i, to: 'tech' },
    { from: /^:dir.*/i, to: 'direction' },
]

function canonicalize(key: string) {
    return keywordAliases
        .filter(({ from }) => from.test(key))
        .map(({ to }) => to)[0] || key
}

function parseKeywordArgs(kwargs: sexp.Item[], allowed = /.*/): any {
    if (kwargs.length === 0) { return {} }

    const [keyword, value, ...rest] = kwargs
    if (!isAtom(keyword)) { throw new Error('Expected keyword to be an atom') }
    if (!isString(value)) { throw new Error('Expected value to be a string') }

    const key = canonicalize(keyword.content)

    return Object.assign(
        allowed.test(key) ? { [key]: value.content } : {},
        parseKeywordArgs(rest, allowed))
}

export class Parser {

    private idMap: { [id: string]: INode }
    private pathMap: { [id: string]: NodeId }
    private edges: IEdge[]
    private items: INode[]
    private graphTitle: string = ''

    constructor() {
        this.idMap = {}
        this.pathMap = {}
        this.edges = []
        this.items = []
    }

    public parse(text: string): IGraph {
        const tokens = sexp.parse(text)
        this.buildIR(tokens)
        for (const e of this.edges) {
            this.postProcessEdge(e)
        }

        return {
            edges: this.edges,
            idMap: this.idMap,
            items: this.items,
            pathMap: this.pathMap,
            roots: this.items
                .filter((x) => !x.parentId)
                .map((x) => x.id),
            title: this.graphTitle,
        }
    }

    private buildIR(tokens: sexp.Item[], parent?: INode) {
        return tokens.map((x) => this.buildIRNode(x, parent))
    }

    private buildIRNode(token: sexp.Item, parent?: INode): INode | IEdge | null {
        if (!isList(token)) {
            throw new Error('bare string not permitted')
        }
        const [head, ...tail] = token.content
        if (!isAtom(head)) {
            throw new Error(`expected atom, found ${head.type}`)
        }
        const node = this._buildIRNode(head.content, tail, parent)
        if (!node) { return null }

        if (!isEdge(node) && !node.children.every(isEdge)) {
            node.canExpand = true
        }
        return node
    }

    private _buildIRNode(head: string, tail: sexp.Item[], parent?: INode): INode | IEdge | null {
        const type = head.replace(/^def(ine)?-/i, '').toLowerCase().trim()
        switch (type) {
            case 'edge':
                return this.edge(tail, parent)
            case 'title':
                this.title(tail, parent)
                return null
            default:
                return this.item(type, tail, parent)
        }
    }

    private item(type: string, tokens: sexp.Item[], parent?: INode): INode {
        const [opts, ...children] = tokens
        if (!isList(opts)) {
            throw new OptsNotFoundError(type)
        }
        const [name, ...kwargs] = opts.content
        if (!isString(name) || name.content === '') {
            throw new NameNotFoundError(type)
        }

        const p = this.pathToNode(name.content, parent).toString()
        const node: INode = {
            children: [],
            id: pathToId(p),
            name: name.content,
            path: p,
            type,
        }
        if (parent) {
            node.parentId = parent.id
        }

        this.idMap[node.id] = node
        this.pathMap[node.path] = node.id
        Object.assign(node,
            parseKeywordArgs(kwargs, /description|tech/))
        this.items.push(node)
        for (const n of this.buildIR(children, node)) {
            if (n) {
                node.children.push(n)
            }
        }
        return node
    }

    private edge(kwargs: sexp.Item[], parent?: INode): IEdge {
        if (!parent) { throw new Error('edge at top level?') }
        const edge = Object.assign(
            { sourceId: parent.id, type: 'edge' },
            parseKeywordArgs(kwargs, /description|to|tech|direction/))
        this.edges.push(edge)
        return edge
    }

    private title([input]: sexp.Item[], parent?: INode): void {
        if (!isString(input)) {
            throw new TitleNotAStringError(input.toString())
        }
        if (parent) { throw new TitleNotAtTopLevelError() }
        this.graphTitle = input.content
    }

    private pathToNode(name: string, parent?: INode): string {
        return parent
            ? this.idMap[parent.id].path + '/' + name
            : name
    }

    private postProcessEdge(edge: IEdge) {
        if (edge.to.startsWith('.')) {
            const src = this.idMap[edge.sourceId]
            if (!src.parentId) {
                throw new Error('relative paths have to have a parent')
            }
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

    private findParentIds(id: string): string[] {
        const node = this.idMap[id]
        if (!node.parentId) { return [] }

        return [node.parentId]
            .concat(this.findParentIds(node.parentId))
    }
}

/*
TODO: detect errors:

* duplicate paths

*/
