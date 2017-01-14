import { parse, SyntaxError, pathToId } from './parse'

describe('parse.js', () => {

    describe('parse', () => {
        it('throws an error with bad input', () => {
            expect(() => parse('(invalid sexp'))
                .toThrowError(SyntaxError)
        })

        it('parses single node', () => {
            const item = {
                name: "foo",
                id: 'acbd18db4cc2f85cedef654fccc4a4d8',
                path: "foo",
                type: 'system',
                children: []
            };

            const result = parse('(system ("foo"))');

            expect(result).toEqual({
                edges: [],
                items: [item],
                roots: [item.id],
                idMap: { [item.id]: item },
                pathMap: { [item.path]: item.id }
            })
        })

        it('parses nested nodes', () => {
            const child = {
                name: 'bar',
                id: '82d0f0fa8551de8b7eb5ecb65eae0261',
                path: 'foo/bar',
                parentId: 'acbd18db4cc2f85cedef654fccc4a4d8',
                type: 'container',
                children: []
            }
            const parent = {
                name: "foo",
                id: 'acbd18db4cc2f85cedef654fccc4a4d8',
                path: "foo",
                type: 'system',
                canExpand: true,
                children: [child]
            };

            const result = parse('(system ("foo") (container ("bar")))');

            expect(result).toEqual({
                edges: [],
                items: [parent, child],
                roots: [parent.id],
                idMap: { [parent.id]: parent, [child.id]: child },
                pathMap: { [parent.path]: parent.id, [child.path]: child.id }
            })
        })

        it('parses edges', () => {
            const dst = {
                name: 'dst',
                id: '28e3d688a3c077b887921cea3fb1dbc7',
                path: 'dst',
                type: 'system',
                children: []
            }
            const edge = {
                sourceId: '25d902c24283ab8cfbac54dfa101ad31',
                sourceParentIds: [],
                to: 'dst',
                destinationId: '28e3d688a3c077b887921cea3fb1dbc7',
                destinationParentIds: [],
                id: 'd94863d3bcf763a82a9bad80c6fa6323',
                type: 'edge'
            }
            const src = {
                name: 'src',
                id: '25d902c24283ab8cfbac54dfa101ad31',
                path: 'src',
                type: 'system',
                children: [edge]
            }

            const result = parse(`
                (system ("src")
                  (edge :to "dst"))
                (system ("dst"))`);

            expect(result).toEqual({
                edges: [edge],
                items: [src, dst],
                roots: [src.id, dst.id],
                idMap: {
                    [dst.id]: dst,
                    [src.id]: src
                },
                pathMap: {
                    [dst.path]: dst.id,
                    [src.path]: src.id
                }
            })
        })

        it('parses edges that cross systems', () => {
            const result = parse(`
                (system ("src")
                  (container ("inner")
                    (edge :to "dst")))
                (system ("dst"))`)

            const edge = result.edges[0]

            expect(edge.sourceId).toBe(pathToId("src/inner"))
            expect(edge.sourceParentIds).toEqual([pathToId("src")])
        })

        it('parses edges that link deeply systems', () => {
            const result = parse(`
                (system ("src")
                    (container ("inner")
                        (edge :to "dst/inner")))
                (system ("dst")
                    (container ("inner")))`)

            const edge = result.edges[0]

            expect(edge.sourceId).toBe(pathToId("src/inner"))
            expect(edge.sourceParentIds).toEqual([pathToId("src")])
            expect(edge.destinationId).toBe(pathToId("dst/inner"))
            expect(edge.destinationParentIds).toEqual([pathToId("dst")])
        })
    })
})