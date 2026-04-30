import type {Failure, Parser, ParserState, Success} from "./types";

const fail = (input: Success<unknown>, reason: string): Failure => ({
    tag: "failure",
    source: input.source,
    index: input.index,
    lineNumber: input.lineNumber,
    lineIndex: input.lineIndex,
    reason,
})

export const str = (text: string): Parser<string> => (input: ParserState<unknown>): ParserState<string> => {
    if (input.tag === "failure") return input;

    if (input.index + text.length > input.source.length) {
        return fail(input, "EOF")
    }

    if (input.current().startsWith(text)) {
        return {
            tag: "success",
            source: input.source,
            index: input.index + text.length,
            lineNumber: input.lineNumber,
            lineIndex: input.lineIndex + 1,
            current: input.current,
            match: text,
        };
    }

    return fail(input, `'${text}' was not found at index ${input.index}`);
}

export const regex = (matcher: RegExp): Parser<string> => (input: ParserState<unknown>): ParserState<string> => {
    if (input.tag === "failure") return input;

    const matches = input.current().match(matcher)
    if (!matches) {
        return fail(input, `the pattern '/${matcher.source}/' did not match at index ${input.index}`)
    }

    const match = matches[0]!
    return {
        tag: "success",
        source: input.source,
        index: input.index + match.length,
        lineNumber: input.lineNumber,
        lineIndex: input.lineIndex + 1,
        current: input.current,
        match,
    }
}

export const eof = (): Parser<string> => (input: ParserState<unknown>): ParserState<string> => {
    if (input.tag === "failure") return input;

    if (input.index === input.source.length) {
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

    return fail(input, `index ${input.index} is not EOF`)
}

const whitespaceMatcher = regex(/^\s+/)
export const whitespace = (): Parser<string> => {
    return (input: ParserState<unknown>): ParserState<string> => whitespaceMatcher(input)
}

const alphaNumericMatcher = regex(/^[a-zA-Z0-9]+/)
export const alphanumeric = (): Parser<string> => {
    return (input: ParserState<unknown>): ParserState<string> => alphaNumericMatcher(input)
}

const integerMatcher = regex(/^\d+/)
export const integer = (): Parser<string> => {
    return (input: ParserState<unknown>): ParserState<string> => integerMatcher(input)
}

const floatMatcher = regex(/^\d+(\.\d+)?/)
export const float = (): Parser<string> => {
    return (input: ParserState<unknown>): ParserState<string> => floatMatcher(input)
}

const eolMatcher = regex(/^[\n\r]{1,2}/)
export const lineEnding = (): Parser<string> => {
    return (input: ParserState<unknown>): ParserState<string> => {
        const result = eolMatcher(input)
        if (result.tag === "failure") return result;

        return {
            tag: "success",
            source: result.source,
            index: result.index,
            lineNumber: result.lineNumber + 1,
            lineIndex: 0,
            current: result.current,
            match: result.match,
        }
    }
}
