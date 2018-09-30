
declare module "sexpr-plus" {
    export function parse(sexp: string): Item[]

    export interface Position {
        offset: number,
        line: number,
        column: number
    }
    export interface Location {
        start: Position,
        end: Position
    }
    export interface List {
        type: 'list',
        content: Array<Item>
        location: Location
    }

    export interface Atom {
        type: 'atom'
        content: string
        location: Location
    }

    export interface String {
        type: 'string'
        content: string
        location: Location
    }

    export interface ExpectedToken {
        type: string,
        value?: string,
        description: string
    }

    export interface SyntaxError {
        message: string,
        expected: ExpectedToken[]
        found: string | null,
        location: Location
    }

    type Item = List | Atom | String;
}