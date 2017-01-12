import { prepareForRendering } from './codegen'
import { parse, pathToId } from './parse'

describe('codegen', () => {
    describe('prepareForRendering', () => {

        it('builds implicit edges when the edge source is hidden', () => {
            const graph = parse(`
                (system ("src")
                    (container ("inner")
                        (edge :to "dst")))
                (system ("dst"))`)

            const prepared = prepareForRendering(graph)

            expect(prepared.items.length).toEqual(2)
            expect(prepared.edges.length).toEqual(1)
            const edge = prepared.edges[0];
            expect(edge.sourceId).toBe(pathToId('src'))
            expect(edge.implicit).toBe(true)
            expect(edge.destinationId).toBe(pathToId('dst'))

        })

        it('displays immediate children when zoomed in', () => {
            const graph = parse(`
                (system ("src")
                    (container ("inner")
                        (edge :to "dst")))
                (system ("dst"))`)

            const prepared = prepareForRendering(graph, pathToId("src"))

            expect(prepared.items.length).toEqual(3)
        })
    })
})