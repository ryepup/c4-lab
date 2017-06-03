import * as lz from 'lz-string'
import Viz from 'viz.js'

type elementCreator = (tagName: string) => HTMLElement

/**
 * convert a graph from DOT text to SVG
 */
export const toSvg = (dot: string) => Viz(dot, { format: 'svg', engine: 'dot' }) as string

/**
 * convert a text representation to an URI-encoded representation
 */
export const uriEncode = (text: string) => lz.compressToEncodedURIComponent(text)

/**
 * convert an URI-encoded representation to a text representation
 */
export const uriDecode = (uriData: string) => lz.decompressFromEncodedURIComponent(uriData)

/**
 * convert DOT text to a png-encoded data URI
 */
export const toPngDataUri = (dot: string, createElement: elementCreator) => {
    const svg = toSvg(dot)
    const img = createElement('img') as HTMLImageElement
    return new Promise((resolve) => {
        img.onload = () => resolve(toDataUrl(img, createElement))
        img.setAttribute('src', 'data:image/svg+xml,' + encodeURIComponent(svg))
    })
}

function toDataUrl(img: HTMLImageElement, createElement: elementCreator) {
    const canvas = createElement('canvas') as HTMLCanvasElement
    canvas.width = img.width
    canvas.height = img.height
    const context = canvas.getContext('2d')
    if (context) {
        context.drawImage(img, 0, 0)
        const dataUrl = canvas.toDataURL('image/png')
        return dataUrl
    }
}
