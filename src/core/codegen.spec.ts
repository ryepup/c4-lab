import { uriDecode, uriEncode } from './codegen'

describe('codegen', () => {
    it('can encode and decode', () => {
        const expected = 'foo bar'
        const actual = uriDecode(uriEncode(expected))

        expect(actual).toBe(expected)
    })
})
