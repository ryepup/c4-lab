import { toPngDataUri } from '../codegen'

export const formats = 'sexp dot png'.split(' ')

export class Exporter {
    private createElement: (e: string) => HTMLElement

    constructor(document: HTMLDocument) {
        this.createElement = (e) => document.createElement(e)
    }

    public export(format: string, title: string | null, text: string, dot: string) {
        const safeTitle = title || 'c4-lab-graph'
        switch (format) {
            case 'sexp':
                return this.sexp(safeTitle, text)
            case 'dot':
                return this.dot(safeTitle, dot)
            case 'png':
                return this.png(safeTitle, dot)
            default:
                throw new Error(`unknown format: ${format}`)
        }
    }

    public sexp(title: string, text: string) {
        this.downloadFile(`${title}.sexp`, text, 'text/plain')
    }

    private dot(title: string, dot: string) {
        this.downloadFile(`${title}.dot`, dot, 'text/plain')
    }

    private png(title: string, dot: string) {
        toPngDataUri(dot, this.createElement)
            .then((dataUri) => this.downloadFile(`${title}.png`, dataUri))
    }

    private downloadFile(filename: string, content: string, contentType?: string) {
        const a = this.createElement('a') as HTMLAnchorElement
        a.download = filename
        if (contentType) {
            a.href = `data:${contentType},${encodeURIComponent(content)}`
        } else {
            a.href = content
        }
        a.click()
    }
}
