/**
 * Contains state information from a successful parser.
 * T is the type of the match: string for basic parsers, Success<T>[] for sequenceOf.
 */
export type Success<T> = {
    readonly tag: "success"
    readonly source: string
    readonly index: number
    readonly lineNumber: number
    readonly lineIndex: number
    readonly current: () => string
    readonly match: T
}

/**
 * Contains information from a failed parser
 */
export type Failure = {
    readonly tag: "failure"
    readonly source: string
    readonly index: number
    readonly lineNumber: number
    readonly lineIndex: number
    readonly reason: string
}

/**
 * The Parser State union
 */
export type ParserState<T> = Success<T> | Failure

/**
 * A Parser transforms a ParserState into a new ParserState.
 * The input match type is unknown because parsers never read it.
 */
export type Parser<T> = (input: ParserState<unknown>) => ParserState<T>
