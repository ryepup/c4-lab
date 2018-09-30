import { GistExporter } from './gist'

describe('GistExporter', () => {
    let exporter, gist, $digest
    const testGistId = 'test id'
    const testGistUrl = 'http://gist'

    beforeEach(inject(($q, $rootScope) => {

        $digest = () => $rootScope.$digest()
        gist = {
            create: jest.fn()
        }

        gist.create.mockReturnValueOnce($q.resolve({
            data: {
                id: testGistId,
                html_url: testGistUrl
            }
        }))

        exporter = new GistExporter({
            getGist: () => gist
        })
    }))

    describe('export()', () => {
        const title = 'test title'
        const sexp = `(title "${title}")`
        const url = 'http://c4-lab?data'
        const gistOptions = () => gist.create.mock.calls[0][0]

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
                        url: new URL(testGistUrl)})
                    done()
                })
            $digest()
        })
    })
})