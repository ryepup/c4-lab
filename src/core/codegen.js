import Viz from 'viz.js'
import lz from 'lz-string';

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
