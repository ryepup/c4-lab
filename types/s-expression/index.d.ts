export = SParse

declare function SParse(src: string) : SParse.ParseError | SParse.Tree

declare namespace SParse {

    export interface ParseError extends Error {
        line: number
        col: number
    }

    export interface Tree extends Array<string | Tree> { }

}