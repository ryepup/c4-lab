import sample from './c4lab.sexp'
import { parse, SyntaxError } from './parse'

describe('parse.js', () => {
    describe('parse', () => {
        it('throws an error with bad input', () => {
            expect(() => parse('(invalid sexp'))
                .toThrowError(SyntaxError)
        })
    })
})