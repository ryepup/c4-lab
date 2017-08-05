declare var SParse: SParse.SParse
export default SParse

declare namespace SParse {

    interface SParse {
        (src: string): ParseError | Tree
        SyntaxError : Error
    }

    interface ParseError extends Error {
        line: number
        col: number
    }

    interface Tree extends Array<string | Tree> { }

}