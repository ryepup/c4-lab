import { GistExporter } from './gist'

describe('GistExporter', () => {
    let exporter, gists, $digest
    const testGistId = 'test id'
    const testGistUrl = 'http://gist'

    beforeEach(inject(($q, $rootScope) => {

        $digest = () => $rootScope.$digest()
        gists = {
            create: jest.fn()
        }

        gists.create.mockReturnValueOnce($q.resolve({
            data: {
                id: testGistId,
                html_url: testGistUrl
            }
        }))

        exporter = new GistExporter({
            gists
        })
    }))

    describe('export()', () => {
        const title = 'test title'
        const sexp = `(title "${title}")`
        const url = 'http://c4-lab?data'
        const gistOptions = () => gists.create.mock.calls[0][0]

        it('writes the sexp', (done) => {
            exporter.export(title, sexp, url)
                .then(() => {
                    expect(gistOptions().files['test title.sexp'].content)
                        .toBe(sexp)
                    done()
                })
            $digest()
        })

        it('writes a README with the URL and title', (done) => {
            exporter.export(title, sexp, url)
                .then(() => {
                    const readme = gistOptions().files['README.md'].content

                    expect(readme).toContain(url)
                    expect(readme).toContain(title)
                    done()
                })
            $digest()
        })

        it('returns simplified info', (done) => {
            exporter.export(title, sexp, url)
                .then((result) => {
                    expect(result).toEqual({
                        id: testGistId,
                        url: new URL(testGistUrl)
                    })
                    done()
                })
            $digest()
        })
    })
})