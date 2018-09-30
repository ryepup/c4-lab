import Github from 'github-api'

interface IGistResult {
    id: string
    url: URL
}

function createReadme(title: string, url: URL) {
    return `# C4 Diagrams for *${title}*

These files were exported from [C4-Lab](https://ryepup.github.io/c4-lab)

[View or edit these diagrams](${url})
`
}

export class GistExporter {

    constructor(private gh = new Github()) { }

    public export(title: string, sexp: string, url: URL): Promise<IGistResult> {
        const gist = this.gh.getGist()
        // TODO: use async/await
        return gist.create({
            description: `C4 diagrams for '${title}'`,
            files: {
                'README.md': {
                    content: createReadme(title, url),
                },
                [`${title}.sexp`]: {
                    content: sexp,
                },
                // TODO: save the top-level SVG
            },
            public: true,
        })
            .then((resp) => {
                return {
                    id: resp.data.id,
                    url: new URL(resp.data.html_url),
                }
            })
    }
}
