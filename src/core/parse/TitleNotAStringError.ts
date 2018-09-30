import ParseError from './ParseError'

export default class TitleNotAStringError extends ParseError {
    constructor(input: string) {
        super('title must be a string, was: ' + JSON.stringify(input))
    }
}
