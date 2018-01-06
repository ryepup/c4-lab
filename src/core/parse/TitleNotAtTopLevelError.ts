import ParseError from './ParseError'

export default class TitleNotAtTopLevelError extends ParseError {
    constructor() {
        super('title is only allowed at the top level')
    }
}
