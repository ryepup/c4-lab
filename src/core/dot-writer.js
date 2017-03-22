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
        const parent = this.graph.idMap[this.rootNode.parentId]

        const visibleIds = this.rootNode.children
            .concat(parent ? parent.children : [])
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

    findVisibleIds(ids) {
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
${indent}  label=<${DOT.b(label)}> style="${style}"`,
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
        const otherChildren = parent.children
            .filter(x => x !== this.rootNode);

        const nextIndent = `${indent}  `

        return [
            `${indent}subgraph cluster_${dotId} {`,
            `${nextIndent}label=<${DOT.b(label)}> style="rounded"`,
            '',
            `${nextIndent}${dotId} [style="invisible"]`,
            this.drawItems(otherChildren, nextIndent),
            '',
            this.drawCluster(nextIndent, this.rootNode, 'solid'),
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
        text = DOT.font("#666666", DOT.i(`&#171;${text}&#187;`))

        return `
<br/>
${text}
<br/>`
    }

    drawItems(nodesOrIds, indent) {
        return nodesOrIds
            .map(x => isString(x) ? this.graph.idMap[x] : x)
            .filter(x => x.type !== 'edge')
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
            shape
        }

        let name = DOT.b(node.name)
        if (this.hrefTo && node.children && node.children.some(x => x.type !== 'edge')) {
            attrs.href = this.hrefTo(node.id)
            attrs.tooltip = `See more details about ${node.name}`
            name = DOT.font('blue', DOT.u(name))
        }

        attrs.label = `<
${name}${tech}${desc}
${indent}>`

        return `${indent}${dotId} ${DOT.attrList(attrs)}`
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

        return `${indent}${src} -> ${dst} ${DOT.attrList(attrs)}`
    }
}

class DOT {
    static i(text) { return `<i>${text}</i>` }
    static b(text) { return `<b>${text}</b>` }
    static u(text) { return `<u>${text}</u>` }
    static font(color, text) { return `<font color="${color}">${text}</font>` }
    static attrList(attrs) {
        const dotAttrs = Reflect.ownKeys(attrs)
            .filter(x => attrs[x])
            .map(x => `${x}=${DOT.quoteAttr(attrs[x])}`)
            .join(' ')

        return `[${dotAttrs}]`
    }
    static quoteAttr(value) {
        return /^</.test(value) ? value : `"${value}"`
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