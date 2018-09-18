import ParseError from './ParseError'

export default class NameNotFoundError extends ParseError {
    constructor(type: string) { super(`missing a name for a ${type}`) }
}
