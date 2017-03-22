import { parse } from '../parse'
import { toDot } from '../dot-writer'

const samples = [
    ['one-system', require('./one-system.sexp'), require('./one-system.dot')],
    ['one-described-system', require('./one-described-system.sexp'), require('./one-described-system.dot')],
    ['one-system-long-description', require('./one-system-long-description.sexp'), require('./one-system-long-description.dot')],
    ['system-with-actor', require('./system-with-actor.sexp'), require('./system-with-actor.dot')],
    ['one-edge', require('./one-edge.sexp'), require('./one-edge.dot')],
    ['two-edges', require('./two-edges.sexp'), require('./two-edges.dot')],
    ['one-edge-long-description', require('./one-edge-long-description.sexp'), require('./one-edge-long-description.dot')],
    ['edge-to-child', require('./edge-to-child.sexp'), require('./edge-to-child.dot')],
    ['edge-from-child', require('./edge-from-child.sexp'), require('./edge-from-child.dot')],
    ['container', require('./container.sexp'), require('./container.dot'), "system"],
    ['title', require('./title.sexp'), require('./title.dot')],
    ['edge-relative-path', require('./edge-relative-path.sexp'), require('./edge-relative-path.dot'), "system"],
    ['unzoomed container', require('./container.sexp'), require('./container-unzoomed.dot')],
    ['edge-from-child-to-child', require('./edge-from-child-to-child.sexp'), require('./edge-from-child-to-child.dot')]
]

const hrefTo = id => `#!/?zoom=${id}`

describe('samples', () => {

    samples.forEach(sample => {
        const [name, sexp, dot, path=null] = sample

        describe(name, () => {
            it('generates the right DOT', () => {
                const graph = parse(sexp)

                const actual = toDot(graph, graph.pathMap[path], hrefTo)

                expect(actual).toBe(dot)
            })
        })
    })
})
