declare var Viz: VizJs.Viz
export default Viz

declare namespace VizJs {

    interface Viz {
        (src: string, opts?: VizOpts): string | HTMLImageElement
        svgXmlToPngImageElement(svgXml: string, scale?: number): HTMLImageElement
        svgXmlToPngImageElement(svgXml: string, scale: number | undefined, callback: ImageCallback): void
        svgXmlToPngBase64(svgXml: string, scale: number | undefined, callback: ImageCallback): void
    }

    interface ImageCallback {
        (error: Error | null, image: HTMLImageElement): void
    }

    type Format = "svg" | "xdot" | "plain" | "ps" | "json" | "png-image-element"
    type Engine = "circo" | "dot" | "neato" | "osage" | "twopi"

    interface VizOpts {
        format?: Format
        engine?: Engine
        scale?: number
        images?: ImageDimensions[],
        totalMemory?: number
    }

    interface ImageDimensions {
        href: string
        height: string
        width: string
    }
}