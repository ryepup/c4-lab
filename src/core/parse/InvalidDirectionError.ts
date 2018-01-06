import ParseError from './ParseError'

export default class InvalidDirectionError extends ParseError {
    constructor(dir: string) {
        super(`Unknown edge direction "${dir}". valid options are "push", "pull", or "both"`)
    }
}
