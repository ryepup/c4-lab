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

export const toPngDataUri = (dot, createElement) => {
    const svg = toSvg(dot)
    const img = createElement('img')
    const canvas = createElement('canvas')

    const imageLoaded = resolve => {
        canvas.width = img.width
        canvas.height = img.height
        canvas.getContext("2d").drawImage(img, 0, 0)
        const dataUrl = canvas.toDataURL("image/png")
        resolve(dataUrl)
    }

    return new Promise(resolve => {
        img.onload = () => { imageLoaded(resolve) }
        img.setAttribute("src", "data:image/svg+xml," + encodeURIComponent(svg))
    })
}