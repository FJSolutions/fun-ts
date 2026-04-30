import type {Failure, Parser, ParserState, Success} from "./types";

type ParsersOf<T extends readonly unknown[]> = { readonly [K in keyof T]: Parser<T[K]> }

/**
 * Runs each parser in order. Returns a Parser<T> where T is a tuple of each
 * parser's match type — so parsers with different match types (e.g. Parser<string>
 * and Parser<string[]>) can be mixed freely. Position tracking (index, lineNumber,
 * etc.) is carried through each step but only the final position is kept on the
 * returned Success. Returns the first Failure encountered.
 */
export const sequenceOf = <T extends readonly unknown[]>(parsers: [...ParsersOf<T>]): Parser<[...T]> =>
    (input: ParserState<unknown>): ParserState<[...T]> => {
        if (input.tag === "failure") return input;

        let state: Success<unknown> = input;
        const values: unknown[] = []

        for (const p of parsers) {
            const next = (p as Parser<unknown>)(state)
            if (next.tag === "failure") return next;
            state = next
            values.push(next.match)
        }

        return {
            tag: "success",
            source: state.source,
            index: state.index,
            lineNumber: state.lineNumber,
            lineIndex: state.lineIndex,
            current: state.current,
            match: values as [...T],
        }
    }

/**
 * Transforms the match value of a successful parse result.
 * Failures are passed through unchanged.
 */
export const map = <A, B>(parser: Parser<A>, fn: (match: A) => B): Parser<B> =>
    (input: ParserState<unknown>): ParserState<B> => {
        const result = parser(input)
        if (result.tag === "failure") return result
        return {
            tag: "success",
            source: result.source,
            index: result.index,
            lineNumber: result.lineNumber,
            lineIndex: result.lineIndex,
            current: result.current,
            match: fn(result.match),
        }
    }

/**
 * Tries each parser in order from the same input position, returning the first
 * Success. If all parsers fail, returns the Failure that got furthest into the
 * input (most informative error). Returns "no alternatives provided" if the
 * array is empty.
 */
export const choice = <T = string>(parsers: Parser<T>[]): Parser<T> =>
    (input: ParserState<unknown>): ParserState<T> => {
        if (input.tag === "failure") return input;

        let deepest: Failure | null = null

        for (const p of parsers) {
            const result = p(input)
            if (result.tag === "success") return result;
            if (deepest === null || result.index >= deepest.index) {
                deepest = result
            }
        }

        return deepest ?? {
            tag: "failure",
            source: input.source,
            index: input.index,
            lineNumber: input.lineNumber,
            lineIndex: input.lineIndex,
            reason: "no alternatives provided",
        }
    }

/**
 * Wraps a parser so that failure is treated as a successful match of "".
 * On failure the input position is unchanged.
 * For string parsers the return type collapses to Parser<string>;
 * for other types the failure value is typed as string (the empty string sentinel).
 */
export const optional = <T>(parser: Parser<T>): Parser<T | string> =>
    (input: ParserState<unknown>): ParserState<T | string> => {
        if (input.tag === "failure") return input;

        const result = parser(input)
        if (result.tag === "success") return result;

        return {
            tag: "success",
            source: input.source,
            index: input.index,
            lineNumber: input.lineNumber,
            lineIndex: input.lineIndex,
            current: input.current,
            match: "",
        }
    }

/**
 * Runs both parsers in order and returns A's match at B's final position.
 * Fails if either parser fails.
 */
export const left = <A, B>(a: Parser<A>, b: Parser<B>): Parser<A> =>
    (input: ParserState<unknown>): ParserState<A> => {
        const ra = a(input)
        if (ra.tag === "failure") return ra;

        const rb = b(ra)
        if (rb.tag === "failure") return rb;

        return {
            tag: "success",
            source: rb.source,
            index: rb.index,
            lineNumber: rb.lineNumber,
            lineIndex: rb.lineIndex,
            current: rb.current,
            match: ra.match,
        }
    }

/**
 * Runs both parsers in order and returns B's result.
 * Fails if either parser fails.
 */
export const right = <A, B>(a: Parser<A>, b: Parser<B>): Parser<B> =>
    (input: ParserState<unknown>): ParserState<B> => {
        const ra = a(input)
        if (ra.tag === "failure") return ra;
        return b(ra)
    }

/**
 * Matches open, parser, close in sequence and returns parser's match.
 * Fails if any of the three parsers fail.
 */
export const between = <O, T, C>(
    open: Parser<O>,
    parser: Parser<T>,
    close: Parser<C>,
): Parser<T> =>
    (input: ParserState<unknown>): ParserState<T> => {
        const ro = open(input)
        if (ro.tag === "failure") return ro;

        const rp = parser(ro)
        if (rp.tag === "failure") return rp;

        const rc = close(rp)
        if (rc.tag === "failure") return rc;

        return {
            tag: "success",
            source: rc.source,
            index: rc.index,
            lineNumber: rc.lineNumber,
            lineIndex: rc.lineIndex,
            current: rc.current,
            match: rp.match,
        }
    }

/**
 * Matches one or more occurrences of parser separated by separator.
 * Returns a Parser<T[]> of the parser match values; separator matches are discarded.
 * The separator is only consumed when the subsequent parser also succeeds.
 * Fails if the parser does not match at least once.
 */
export const sepBy1 = <T, S>(parser: Parser<T>, separator: Parser<S>): Parser<T[]> =>
    (input: ParserState<unknown>): ParserState<T[]> => {
        if (input.tag === "failure") return input;

        const first = parser(input)
        if (first.tag === "failure") return first;

        const values: T[] = [first.match]
        let state: Success<unknown> = first

        while (true) {
            const sep = separator(state)
            if (sep.tag === "failure") break;

            const next = parser(sep)
            if (next.tag === "failure") break;

            values.push(next.match)
            state = next
        }

        return {
            tag: "success",
            source: state.source,
            index: state.index,
            lineNumber: state.lineNumber,
            lineIndex: state.lineIndex,
            current: state.current,
            match: values,
        }
    }

/**
 * Matches zero or more occurrences of parser separated by separator.
 * Returns a Parser<T[]>; always succeeds, returning [] when nothing matches.
 * The separator is only consumed when the subsequent parser also succeeds.
 */
export const sepBy = <T, S>(parser: Parser<T>, separator: Parser<S>): Parser<T[]> =>
    (input: ParserState<unknown>): ParserState<T[]> => {
        if (input.tag === "failure") return input;

        const result = sepBy1(parser, separator)(input)
        if (result.tag === "success") return result;

        return {
            tag: "success",
            source: input.source,
            index: input.index,
            lineNumber: input.lineNumber,
            lineIndex: input.lineIndex,
            current: input.current,
            match: [],
        }
    }

/**
 * Defers parser construction until the first parse attempt.
 * Use this to break circular references between mutually recursive parsers:
 * declare the lazy wrapper before its dependencies, then define the real parser
 * after all its dependencies are in scope.
 */
export const lazy = <T>(getParser: () => Parser<T>): Parser<T> =>
    (input: ParserState<unknown>): ParserState<T> =>
        getParser()(input)

/**
 * Replaces the failure reason of a parser with a human-readable name.
 * On success the result is returned unchanged.
 * Use this to produce clear error messages instead of raw pattern strings.
 */
export const label = <T>(parser: Parser<T>, name: string): Parser<T> =>
    (input: ParserState<unknown>): ParserState<T> => {
        const result = parser(input)
        if (result.tag === "success") return result;
        return {
            tag: "failure",
            source: result.source,
            index: result.index,
            lineNumber: result.lineNumber,
            lineIndex: result.lineIndex,
            reason: `expected ${name}`,
        }
    }


/**
 * Matches zero or more occurrences of parser. Always succeeds.
 * Stops when the parser fails or when it succeeds without advancing the index
 * (zero-width match guard to prevent infinite loops).
 */
export const many = <T>(parser: Parser<T>): Parser<T[]> =>
    (input: ParserState<unknown>): ParserState<T[]> => {
        if (input.tag === "failure") return input;

        const values: T[] = []
        let state: Success<unknown> = input

        while (true) {
            const result = parser(state)
            if (result.tag === "failure") break;
            if (result.index === state.index) break; // zero-width guard
            values.push(result.match)
            state = result
        }

        return {
            tag: "success",
            source: state.source,
            index: state.index,
            lineNumber: state.lineNumber,
            lineIndex: state.lineIndex,
            current: state.current,
            match: values,
        }
    }

/**
 * Matches one or more occurrences of parser.
 * Fails if the parser does not match at least once.
 */
export const many1 = <T>(parser: Parser<T>): Parser<T[]> =>
    (input: ParserState<unknown>): ParserState<T[]> => {
        if (input.tag === "failure") return input;

        const first = parser(input)
        if (first.tag === "failure") return first;

        const rest = many(parser)(first)
        if (rest.tag === "failure") return rest;

        return {
            tag: "success",
            source: rest.source,
            index: rest.index,
            lineNumber: rest.lineNumber,
            lineIndex: rest.lineIndex,
            current: rest.current,
            match: [first.match, ...rest.match],
        }
    }

/**
 * Matches zero or more occurrences of parser until terminator succeeds.
 * The terminator is tried first on each iteration, so the parser does not
 * need to exclude the terminator character. The terminator is consumed and
 * its match is discarded; only parser match values are returned.
 * Fails if neither parser nor terminator matches (e.g. unexpected EOF).
 */
export const manyTill = <T, E>(parser: Parser<T>, terminator: Parser<E>): Parser<T[]> =>
    (input: ParserState<unknown>): ParserState<T[]> => {
        if (input.tag === "failure") return input;

        const values: T[] = []
        let state: Success<unknown> = input

        while (true) {
            const term = terminator(state)
            if (term.tag === "success") {
                return {
                    tag: "success",
                    source: term.source,
                    index: term.index,
                    lineNumber: term.lineNumber,
                    lineIndex: term.lineIndex,
                    current: term.current,
                    match: values,
                }
            }

            const next = parser(state)
            if (next.tag === "failure") return next;
            if (next.index === state.index) break; // zero-width guard

            values.push(next.match)
            state = next
        }

        return {
            tag: "success",
            source: state.source,
            index: state.index,
            lineNumber: state.lineNumber,
            lineIndex: state.lineIndex,
            current: state.current,
            match: values,
        }
    }