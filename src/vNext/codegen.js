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
    const ensureBothEndsAreVisible = edge => {
        const srcVisible = isIdVisible(edge.sourceId)
        const dstVisible = isIdVisible(edge.destinationId)
        if (srcVisible && dstVisible) {
            return edge;
        } else if (!srcVisible) {
            return Object.assign({}, edge, {
                sourceId: edge.sourceParentIds.find(isIdVisible),
                implicit: true
            })
        } else if (!dstVisible) {
            return Object.assign({}, edge, {
                destinationId: edge.destinationParentIds.find(isIdVisible),
                implicit: true
            })
        } else {
            throw new Error('how!?')
        }
    }
    const visibleEdges = graph.edges
        .filter(x => isIdVisible(x.sourceId) || isIdVisible(x.destinationId))
        .map(ensureBothEndsAreVisible)


    return {
        items: visibleIds
            .map(x => Object.assign({}, graph.idMap[x], { children: null })),
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