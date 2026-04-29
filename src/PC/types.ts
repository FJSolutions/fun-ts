/**
 * ParserState contains all the state for a Parser to match
 */
export type ParserState = {
    readonly source: string
    readonly index: number
    readonly line: number
    readonly lineIndex: number
    current: () => string
    match: string
    readonly isError: boolean
    readonly reason: string | null
}

/**
 * A parser is a function that transforms one ParserState yto another
 */
export type Parser = (input: ParserState) => ParserState
