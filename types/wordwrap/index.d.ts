declare var wordwrap: Wordwrap.wordwrap
export = wordwrap

declare namespace Wordwrap {

    interface wordwrap {
        (start: number, stop: number, params: Options): WrapFunction
        (stop: number): WrapFunction
        hard(start: number, stop: number): WrapFunction
        soft(start: number, stop: number): WrapFunction
    }

    interface Options {
        mode: WrapMode
    }

    type WrapMode = 'soft' | 'hard'
    type WrapFunction = (text: string) => string
}