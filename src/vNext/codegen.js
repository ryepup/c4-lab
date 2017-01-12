import Viz from 'viz.js'
import lz from 'lz-string';

/**
 * resolve any links into a exporter-friendly format
 */
export const prepareForRendering = (graph, zoomNodeId) => {

    const visibleIds = zoomNodeId
        ? graph.idMap[zoomNodeId]
            .children
            .map(x => x.id)
            .concat(graph.roots)
        : graph.roots

    const isIdVisible = x => visibleIds.includes(x)
    const toGraphableEdge = edge => {
        const srcOk = isIdVisible(edge.sourceId)
        const dstOk = isIdVisible(edge.destinationId)

        const {type, id, description} = edge;

        return {
            type, id, description,
            sourceId: srcOk
                ? edge.sourceId
                : edge.sourceParentIds.find(isIdVisible),
            destinationId: dstOk
                ? edge.destinationId
                : edge.destinationParentIds.find(isIdVisible),
            implicit: !(srcOk && dstOk)
        }
    }
    const visibleEdges = graph.edges
        .filter(x => isIdVisible(x.sourceId) || isIdVisible(x.destinationId))
        .map(toGraphableEdge)

    const toGraphableItem = id => {
        const {type, name, description, tech, parentId} = graph.idMap[id]
        return { type, id, name, description, tech, parentId }
    }

    return {
        items: visibleIds.map(toGraphableItem),
        edges: visibleEdges
    };
}

/**
 * convert a graph from DOT text to SVG
 */
export const toSvg = dot => Viz(dot, { format: "svg", engine: "dot" })

/**
 * convert a text representation to an URI-encoded representation
 */
export const uriEncode = text => lz.compressToEncodedURIComponent(text)

/**
 * convert an URI-encoded representation to a text representation
 */
export const uriDecode = uriData =>
    lz.decompressFromEncodedURIComponent(uriData)