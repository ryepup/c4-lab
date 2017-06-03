declare var Viz: VizJs.VizStatic
export default Viz

declare namespace VizJs {

    interface VizStatic {
        (dot: string, opts?: VizOpts): string | HTMLImageElement
    }

    interface VizOpts {
        format?: string
        engine?: string
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