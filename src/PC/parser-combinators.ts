import type {Parser, ParserState} from "./types";

/**
 * A parser combinator that matches all the supplied parsers in sequence
 * @param parsers The sequence of parsers to match
 */
export const sequenceOf = (parsers: Parser[]): Parser => (input: ParserState): ParserState => {
    let state = input
    let result: string[] = []

    for (const p of parsers) {
        state = p(state)
        if (state.isError) {
            return {
                ...input,
                isError: true,
                reason: state.reason,
            }
        }

        result.push(state.match as string)
    }

    return {
        ...state,
        match: result.join("")
    }
}

// TODO: Transformers
// map(parser, fn)

// TODO: Sequence
// left(a, b)
// right(a, b)
// between(open, parser, close)
// sepBy(parser, separator)
// sepBy1(parser, separator)

// TODO: Alt
// choice(...parsers)
// optional(parser)

// TODO: Repetition
// many(parser)
// many1(parser)
// manyTill(parser, terminator) // Is it necessary?

// TODO: Error
// label(parser, name)