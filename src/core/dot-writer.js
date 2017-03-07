import wordwrap from 'wordwrap'
import { flattenDeep, isString } from 'lodash'


const DEFAULT_SHAPE = 'box'
const typeShapeMap = {
    actor: 'egg',
    container: 'box3d'
}

/**
 * does this node have children that aren't edges?
 * 
 * @param {*} node 
 * @returns {boolean}
 */
function hasNonEdgeChildren(node) {
    return node && node.children
        && node.children.some(x => x.type !== 'edge')
}

export class DotContext {
    constructor(hrefTo) {
        this.indent = ''
        this.lines = []
        this.wordwrap = wordwrap(30)
        this.hrefTo = hrefTo
    }

    load(graph, zoomNodeId) {
        this.graph = graph
        this.rootNode = graph.idMap[zoomNodeId]
        this.visibleIds = zoomNodeId
            ? this.rootNode
                .children
                .map(x => x.id)
                .concat(graph.roots)
            : graph.roots

        this.visibleIds.sort()

        this.visibleEdges = graph.edges
            .filter(x => this.isEdgeVisible(x))
    }

    toDotId(nodeOrId) {
        const id = isString(nodeOrId) ? nodeOrId : nodeOrId.id

        return 'g' + this.visibleIds.indexOf(id)
    }

    toDescription(nodeOrText, htmlNewlines = true) {
        const text = isString(nodeOrText) ? nodeOrText : nodeOrText.description

        if (!text) return ''

        const wrapped = this.wordwrap(text)

        return htmlNewlines
            ? wrapped.replace(/\n/g, '<br/>\n')
            : wrapped
    }

    toLabel(edgeOrText) {
        return this.toDescription(edgeOrText, false)
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
    }

    isEdgeVisible(edge) {
        return this.isIdVisible(edge.sourceId)
            || this.isIdVisible(edge.destinationId)
    }

    isIdVisible(id) {
        return this.visibleIds.includes(id)
    }

    addLine(text) { this.lines.push(text) }

    drawCluster(indent) {
        const dotId = this.toDotId(this.rootNode)
        const label = this.toLabel(this.rootNode.name)

        const nonClustered = this.graph.roots
            .filter(x => x !== this.rootNode.id)

        return [
            `${indent}subgraph cluster_${dotId} {
${indent}${indent}label=<<b>${label}</b>> style="rounded"`,
            '',
            this.drawItems(this.rootNode.children, indent + '  '),
            `${indent}}`,
            this.drawItems(nonClustered, indent)
        ]
    }

    draw() {
        const lines = [`digraph g {`]
            .concat([...this.digraphHeaders('  ')])
            .concat([
                this.rootNode
                    ? this.drawCluster('  ')
                    : this.drawItems(this.visibleIds, '  '),
                '',
                this.visibleEdges
                    .map(x => this.drawEdge(x, '  ')),
                '}', ''
            ])

        return flattenDeep(lines).join('\n')
    }

    * digraphHeaders(indent) {
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

    toTechDescription(text) {
        if (!text) return ''

        text = this.toDescription(text)

        return `
<br/>
<font color="#666666"><i>&#171;${text}&#187;</i></font>
<br/>`
    }

    drawItems(nodesOrIds, indent) {
        return nodesOrIds
            .map(x => isString(x) ? this.graph.idMap[x] : x)
            .map(x => this.drawItem(x, indent))
    }

    drawItem(node, indent) {
        const dotId = this.toDotId(node)

        const tech = this.toTechDescription(node.tech)

        const desc = node.description
            ? '\n<br/>\n' + this.toDescription(node)
            : ''

        const shape = typeShapeMap[node.type] || DEFAULT_SHAPE

        const attrs = {
            shape: `"${shape}"`
        }

        if (this.hrefTo && hasNonEdgeChildren(node)) {
            attrs.href = `"${this.hrefTo(node.id)}"`
            attrs.tooltip = `"See more details about ${node.name}"`
        }

        attrs.label = `<
<b>${node.name}</b>${tech}${desc}
${indent}>`

        const dotAttrs = Reflect.ownKeys(attrs)
            .map(x => `${x}=${attrs[x]}`)
            .join(' ')

        return `${indent}${dotId} [${dotAttrs}]`
    }

    drawEdge(edge, indent) {

        const srcOk = this.isIdVisible(edge.sourceId)
        const dstOk = this.isIdVisible(edge.destinationId)

        const getId = (idOk, id, parentIds) => {
            return idOk ? id : parentIds.find(x => this.isIdVisible(x))
        }

        const src = this.toDotId(
            getId(srcOk, edge.sourceId, edge.sourceParentIds))
        const dst = this.toDotId(
            getId(dstOk, edge.destinationId, edge.destinationParentIds))

        const attrs = {}

        if (edge.description) {
            attrs.label = this.toLabel(edge)
        }

        if (!(srcOk && dstOk)) {
            attrs.style = 'dashed'
        }

        const dotAttrs = Reflect.ownKeys(attrs)
            .map(x => `${x}="${attrs[x]}"`)
            .join(' ')

        return `${indent}${src} -> ${dst} [${dotAttrs}]`
    }
}


/**
 * build a DOT representation of the graph
 */
export const toDot = (graph, zoomNodeId, hrefTo) => {
    const ctx = new DotContext(hrefTo)
    ctx.load(graph, zoomNodeId)
    return ctx.draw()
}