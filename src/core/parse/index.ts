import { Parser } from './Parser'
export { SyntaxError } from 'sexpr-plus'
export { default as ParseError } from './ParseError'
export { default as InvalidDirectionError } from './InvalidDirectionError'
export { default as OptsNotFoundError } from './OptsNotFoundError'
export { default as NameNotFoundError } from './NameNotFoundError'

export const parse = (text: string) => new Parser().parse(text)
