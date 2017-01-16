import { DotContext } from './dot-writer'

describe('dot-writer', () => {
    describe('DotContext', () => {
        let ctx

        beforeEach(() => {
            ctx = new DotContext()
        })

        describe('toDescription', () => {
            it('converts null to empty', () => {
                expect(ctx.toDescription({ description: null }))
                    .toBe('')
            })

            it('converts undefined to empty', () => {
                expect(ctx.toDescription({}))
                    .toBe('')
            })

            it('does not modify and already safe string', () => {
                const description = 'already safe'

                expect(ctx.toDescription({ description }))
                    .toBe(description)
            })

            it('wraps long lines', () => {
                const description = "I am the very model of a modern major general"

                expect(ctx.toDescription({ description }, false))
                    .toBe("I am the very model of a\nmodern major general")
            })
        })

        describe('toLabel', () => {
            it('converts null to empty', () => {
                expect(ctx.toLabel({ description: null }))
                    .toBe('')
            })

            it('converts undefined to empty', () => {
                expect(ctx.toLabel({}))
                    .toBe('')
            })

            it('does not modify and already safe string', () => {
                const description = 'already safe'

                expect(ctx.toLabel({ description }))
                    .toBe(description)
            })

            it('escapes double quotes', () => {
                const description = 'a "b" c'

                expect(ctx.toLabel({ description }))
                    .toBe('a \\"b\\" c')
            })

            it('wraps long lines', () => {
                const description = "I am the very model of a modern major general"

                expect(ctx.toLabel({ description }))
                    .toBe("I am the very model of a\\nmodern major general")
            })
        })
    })
})