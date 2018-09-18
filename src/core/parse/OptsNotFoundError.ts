import ParseError from './ParseError'

export default class OptsNotFoundError extends ParseError {
    constructor(type: string) { super(`missing options for a ${type}`) }
}
