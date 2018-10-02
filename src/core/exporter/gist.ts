import * as Octokit from '@octokit/rest'

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

    constructor(private gh: Octokit) { }

    public export(title: string, sexp: string, url: URL): Promise<IGistResult> {
        // TODO: use async/await
        return this.gh.gists.create({
            description: `C4 diagrams for '${title}'`,
            // octokit types are just wrong
            files: this.createFiles(title, url, sexp) as Octokit.GistsCreateParamsFiles,
            public: false,
        })
            .then((resp) => {
                return {
                    id: resp.data.id,
                    url: new URL(resp.data.html_url),
                }
            })
    }

    private createFiles(title: string, url: URL, sexp: string) {
        return {
            'README.md': {
                content: createReadme(title, url),
            },
            [`${title}.sexp`]: {
                content: sexp,
            },
        }
    }
}
