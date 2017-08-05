import { flattenDeep, isString, uniq } from 'lodash'
import * as wordwrap from 'wordwrap'
import { DOT } from './DOT'
import { IEdge, IGraph, INode, NodeId } from './interfaces'

const DEFAULT_SHAPE = 'box'
const typeShapeMap: any = {
    actor: 'egg',
    component: 'component',
    container: 'box3d',
}

const VERBOSE = false
const INDENT = '  '

export class DotContext {
    private wordwrap: (text: string) => string
    private hrefTo?: (text: string) => string
    private graph: IGraph
    private zoomNodeId: NodeId
    private visibleIds: NodeId[]
    private visibleEdges: IEdge[]
    private rootNode: INode

    constructor(hrefTo?: ((text: string) => string)) {
        // TODO: why doesn't `wordwrap(30)` work? Something about typescript definitions
        this.wordwrap = wordwrap.soft(0, 30)
        this.hrefTo = hrefTo
    }

    public load(graph: IGraph, zoomNodeId: NodeId) {
        this.graph = graph
        this.zoomNodeId = zoomNodeId
        this.visibleIds = zoomNodeId
            ? this.findVisibleNodes(zoomNodeId)
            : graph.roots

        this.visibleIds.sort()

        this.visibleEdges = graph.edges
            .filter((x) => this.isEdgeVisible(x))
    }

    public draw() {
        return [...this._draw()].join('\n')
    }

    private * _draw() {
        yield `digraph g {`
        yield* this.digraphHeaders(INDENT)
        if (this.rootNode) {
            if (this.rootNode.parentId) {
                yield* this.drawChildCluster(INDENT, this.rootNode.parentId)
            } else {
                yield* this.drawCluster(INDENT, this.rootNode)
            }
        } else {
            yield* this.drawItems(this.visibleIds, INDENT)
        }
        yield ''
        yield* this.visibleEdges.map((x) => this.drawEdge(x, INDENT))
        yield '}'
        yield ''
    }

    private findVisibleNodes(zoomNodeId: NodeId) {
        this.rootNode = this.graph.idMap[zoomNodeId]
        let visibleNodes = this.rootNode.children
            .concat([this.rootNode])

        if (this.rootNode.parentId) {
            const parent = this.graph.idMap[this.rootNode.parentId]
            visibleNodes = visibleNodes.concat(parent.children)
            visibleNodes.push(parent)
        }

        const visibleIds = visibleNodes
            .map((x) => x.id)
            .concat(this.graph.roots)
            .filter((x) => x)

        return uniq(visibleIds)
    }

    private toDotId(nodeOrId: string | INode | IEdge) {
        const id = isString(nodeOrId) ? nodeOrId : nodeOrId.id

        return 'g' + this.visibleIds.indexOf(id)
    }

    private toDescription(nodeOrText: string | INode | IEdge, htmlNewlines = true) {
        const text = isString(nodeOrText) ? nodeOrText : nodeOrText.description

        if (!text) { return '' }

        const wrapped = this.wordwrap(text)

        return htmlNewlines
            ? wrapped.replace(/\n/g, '<br/>\n')
            : wrapped
    }

    private toLabel(edgeOrText: string | IEdge) {
        return this.toDescription(edgeOrText, false)
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
    }

    private isEdgeVisible(edge: IEdge) {
        return this.isIdVisible(edge.sourceId)
            || this.isIdVisible(edge.destinationId)
            || this.isCrossingSystems(edge)
    }

    private isCrossingSystems(edge: IEdge) {
        const visibleSourceIds = this.findVisibleIds(edge.sourceParentIds)
        const visibleDestinationIds = this.findVisibleIds(edge.destinationParentIds)

        return visibleSourceIds[0] !== visibleDestinationIds[0]
    }

    private findVisibleIds(ids: string[]) {
        return ids.filter((x) => this.isIdVisible(x))
    }

    private isIdVisible(id: string) {
        return this.visibleIds.includes(id)
    }

    private * drawCluster(indent: string, rootNode: INode, style = 'rounded') {
        const dotId = this.toDotId(rootNode)
        const label = this.toLabel(rootNode.name)

        if (VERBOSE) { yield `${indent}# <drawCluster>` }
        yield `${indent}subgraph cluster_${dotId} {
${indent}  label=<${DOT.b(label)}> style="${style}"`
        yield ''
        yield `${indent}  ${dotId} [style="invisible"]`
        yield ''
        yield* this.drawItems(rootNode.children, indent + INDENT)
        yield `${indent}}`
        if (!rootNode.parentId) {
            const nonClustered = this.graph.roots
                .filter((x) => x !== rootNode.id)
                .filter((x) => x !== rootNode.parentId)

            yield* this.drawItems(nonClustered, indent)
        }
        if (VERBOSE) { yield `${indent}# </drawCluster>` }
    }

    private * drawChildCluster(indent: string, parentId: NodeId) {
        const parent = this.graph.idMap[parentId]
        const dotId = this.toDotId(parent)
        const label = this.toLabel(parent.name)

        const nonClustered = this.graph.roots
            .filter((x) => x !== parent.id)
        const otherChildren = parent.children
            .filter((x) => x !== this.rootNode)

        const nextIndent = `${indent}${INDENT}`

        if (VERBOSE) { yield `${indent}# <drawChildCluster>` }
        yield `${indent}subgraph cluster_${dotId} {`
        yield `${nextIndent}label=<${DOT.b(label)}> style="rounded"`
        yield ''
        yield `${nextIndent}${dotId} [style="invisible"]`
        yield* this.drawItems(otherChildren, nextIndent)
        yield ''
        yield* this.drawCluster(nextIndent, this.rootNode, 'solid')
        yield `${indent}}`
        yield* this.drawItems(nonClustered, indent)
        if (VERBOSE) { yield `${indent}# </drawChildCluster>` }
    }

    private * digraphHeaders(indent: string) {
        yield `${indent}compound=true`
        if (this.graph.title) {
            yield `${indent}label="${this.toLabel(this.graph.title)}"`
            yield `${indent}fontsize=20`
            yield `${indent}labelloc=t`
        }
        yield `${indent}node[fontsize=12]`
        yield `${indent}edge[fontsize=12]`
        yield ''
    }

    private toTechDescription(text?: string) {
        if (!text) { return '' }

        text = this.toDescription(text)
        text = DOT.font('#666666', DOT.i(`&#171;${text}&#187;`))

        return `
<br/>
${text}
<br/>`
    }

    private * drawItems(nodesOrIds: Array<string | INode | IEdge>, indent: string) {
        if (VERBOSE) { yield `${indent}# <drawItems>` }
        yield* nodesOrIds
            .map((x) => isString(x) ? this.graph.idMap[x] : x)
            .filter((x) => x.type !== 'edge')
            .map((x) => this.drawItem((x as INode), indent))
        if (VERBOSE) { yield `${indent}# </drawItems>` }
    }

    private drawItem(node: INode, indent: string) {
        const dotId = this.toDotId(node)

        const tech = this.toTechDescription(node.tech)

        const desc = node.description
            ? '\n<br/>\n' + this.toDescription(node)
            : ''

        const shape = typeShapeMap[node.type] || DEFAULT_SHAPE

        const attrs: any = {
            shape,
        }

        let name = DOT.b(node.name)
        if (this.hrefTo && node.children && node.children.some((x) => x.type !== 'edge')) {
            attrs.href = this.hrefTo(node.id)
            attrs.tooltip = `See more details about ${node.name}`
            name = DOT.font('blue', DOT.u(name))
        }

        attrs.label = `<
${name}${tech}${desc}
${indent}>`

        return `${indent}${dotId} ${DOT.attrList(attrs)}`
    }

    private drawEdge(edge: IEdge, indent: string) {

        const srcOk = this.isIdVisible(edge.sourceId)
        const dstOk = this.isIdVisible(edge.destinationId)

        const getId = (idOk: boolean, id: NodeId, parentIds: NodeId[]) => {
            const result = idOk
                ? id
                : parentIds.find((x) => this.isIdVisible(x))

            if (result) { return result }
            throw new Error('Unknown id')
        }

        const srcId = getId(srcOk, edge.sourceId, edge.sourceParentIds)
        const dstId = getId(dstOk, edge.destinationId, edge.destinationParentIds)

        const src = this.toDotId(srcId)
        const dst = this.toDotId(dstId)

        const attrs: any = {}

        if (edge.description) {
            attrs.label = this.toLabel(edge)
        }

        if (!(srcOk && dstOk)) {
            attrs.style = 'dashed'
        }

        if (srcId === this.zoomNodeId) {
            attrs.ltail = `cluster_${src}`
        }

        if (dstId === this.zoomNodeId) {
            attrs.lhead = `cluster_${dst}`
        }
        attrs.dir = this.getEdgeDirection(edge.direction)

        return `${indent}${src} -> ${dst} ${DOT.attrList(attrs)}`
    }

    private getEdgeDirection(direction: string | undefined): string | null {
        switch (direction) {
            case 'both':
                return 'both'
            case 'pull':
                return 'back'
            default:
                return null
        }
    }
}

/**
 * build a DOT representation of the graph
 */
export const toDot = (graph: IGraph, zoomNodeId: NodeId, hrefTo: (id: string) => string) => {
    const ctx = new DotContext(hrefTo)
    ctx.load(graph, zoomNodeId)
    return ctx.draw()
}
