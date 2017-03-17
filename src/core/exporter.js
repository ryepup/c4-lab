import { toPngDataUri } from './codegen'

export const formats = 'sexp dot png'.split(' ')

export class Exporter {

    constructor(document) {
        this.createElement = e => document.createElement(e)
    }

    export(format, title, text, dot) {
        this[format](title || 'c4-lab-graph', text, dot)
    }

    sexp(title, text) {
        this.downloadFile(`${title}.sexp`, text, 'text/plain')
    }

    dot(title, text, dot) {
        this.downloadFile(`${title}.dot`, dot, 'text/plain')
    }

    png(title, text, dot) {
        toPngDataUri(dot, this.createElement)
            .then(dataUri => this.downloadFile(`${title}.png`, dataUri))
    }

    downloadFile(filename, content, contentType = null) {
        const a = this.createElement('a');
        a.download = filename;
        if (contentType) {
            a.href = `data:${contentType},${encodeURIComponent(content)}`;
        } else {
            a.href = content;
        }
        a.click();
    }
}