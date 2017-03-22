import wordwrap from 'wordwrap'
import { flattenDeep, isString, uniq } from 'lodash'


const DEFAULT_SHAPE = 'box'
const typeShapeMap = {
    actor: 'egg',
    container: 'box3d',
    component: 'component'
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
        this.zoomNodeId = zoomNodeId
        this.visibleIds = zoomNodeId
            ? this.findVisibleNodes(zoomNodeId)
            : graph.roots

        this.visibleIds.sort()

        this.visibleEdges = graph.edges
            .filter(x => this.isEdgeVisible(x))
    }

    findVisibleNodes(zoomNodeId) {
        this.rootNode = this.graph.idMap[zoomNodeId]

        const visibleIds = this.rootNode.children
            .map(x => x.id)
            .concat(this.graph.roots)
            .concat([this.rootNode.id, this.rootNode.parentId])
            .filter(x => x)

        return uniq(visibleIds)
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
            || this.isCrossingSystems(edge)
    }

    isCrossingSystems(edge) {
        const visibleSourceIds = this.findVisibleIds(edge.sourceParentIds)
        const visibleDestinationIds = this.findVisibleIds(edge.destinationParentIds)

        return visibleSourceIds[0] !== visibleDestinationIds[0]
    }

    findVisibleIds(ids){
        return ids.filter(x => this.isIdVisible(x))
    }

    isIdVisible(id) {
        return this.visibleIds.includes(id)
    }

    drawCluster(indent, rootNode, style = "rounded") {
        const dotId = this.toDotId(rootNode)
        const label = this.toLabel(rootNode.name)

        const nonClustered = this.graph.roots
            .filter(x => x !== rootNode.id)
            .filter(x => x !== rootNode.parentId)

        return [
            `${indent}subgraph cluster_${dotId} {
${indent}  label=<<b>${label}</b>> style="${style}"`,
            '',
            `${indent}  ${dotId} [style="invisible"]`,
            '',
            this.drawItems(rootNode.children, indent + '  '),
            `${indent}}`,
            rootNode.parentId ? [] : this.drawItems(nonClustered, indent)
        ]
    }

    drawChildCluster(indent) {
        const parent = this.graph.idMap[this.rootNode.parentId]
        const dotId = this.toDotId(parent)
        const label = this.toLabel(parent.name)

        const nonClustered = this.graph.roots
            .filter(x => x !== parent.id)

        return [
            `${indent}subgraph cluster_${dotId} {`,
            `${indent}${indent}label=<<b>${label}</b>> style="rounded"`,
            '',
            `${indent}${indent}${dotId} [style="invisible"]`,
            '',
            this.drawCluster(`${indent}${indent}`, this.rootNode, 'solid'),
            `${indent}}`,
            this.drawItems(nonClustered, indent)
        ]
    }

    draw() {
        const lines = [`digraph g {`]
            .concat([...this.digraphHeaders('  ')])
            .concat([
                this.rootNode && this.rootNode.parentId
                    ? this.drawChildCluster('  ')
                    : this.rootNode
                        ? this.drawCluster('  ', this.rootNode)
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

        if (this.hrefTo && node.children && node.children.some(x => x.type !== 'edge')) {
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

        const srcId = getId(srcOk, edge.sourceId, edge.sourceParentIds)
        const dstId = getId(dstOk, edge.destinationId, edge.destinationParentIds)

        const src = this.toDotId(srcId)
        const dst = this.toDotId(dstId)

        const attrs = {}

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