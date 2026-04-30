import type {Failure, Parser, ParserState, Success} from "./types";
import {choice, many1, map} from "./parser-combinators";

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

const inlineWhitespaceMatcher = regex(/^[^\S\r\n]+/)
export const inlineWhitespace = (): Parser<string> => {
    return (input: ParserState<unknown>): ParserState<string> => inlineWhitespaceMatcher(input)
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

const eolMatcher = regex(/^(\r\n|\r|\n)/)
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

/**
 * Matches one or more whitespace characters, including line endings.
 * Each lineEnding encountered increments lineNumber so that position tracking
 * remains accurate across multi-line whitespace.
 */
export const whitespace = (): Parser<string> =>
    map(
        many1(choice([inlineWhitespace(), lineEnding()])),
        parts => parts.join("")
    )

/**
 * Matches any single character. Fails at EOF.
 * CRLF is treated as one character (advances index by 2).
 * Line endings increment lineNumber and reset lineIndex, matching lineEnding behaviour.
 */
export const anyChar = (): Parser<string> =>
    (input: ParserState<unknown>): ParserState<string> => {
        if (input.tag === "failure")
            return input;
        if (input.index >= input.source.length)
            return fail(input, "EOF");

        const cur = input.current();

        if (cur.startsWith("\r\n")) {
            return {
                tag: "success",
                source: input.source,
                index: input.index + 2,
                lineNumber: input.lineNumber + 1,
                lineIndex: 0,
                current: input.current,
                match: "\r\n",
            };
        }

        if (cur[0] === "\r" || cur[0] === "\n") {
            return {
                tag: "success",
                source: input.source,
                index: input.index + 1,
                lineNumber: input.lineNumber + 1,
                lineIndex: 0,
                current: input.current,
                match: cur[0],
            };
        }

        return {
            tag: "success",
            source: input.source,
            index: input.index + 1,
            lineNumber: input.lineNumber,
            lineIndex: input.lineIndex + 1,
            current: input.current,
            match: cur[0]!,
        };
    }
