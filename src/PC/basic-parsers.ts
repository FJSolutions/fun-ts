import type {Parser, ParserState} from "./types";

/**
 * Creates a Parser that matches the supplied `text`
 * @param text The string to find
 */
export const str = (text: string): Parser => (input: ParserState): ParserState => {
    if (!input.isError) {
        if (input.index + text.length > input.source.length) {
            return {
                ...input,
                isError: true,
                reason: "EOF"
            }
        }

        if (input.current().startsWith(text)) {
            return {
                ...input,
                match: text,
                index: input.index + text.length,
                lineIndex: input.lineIndex + 1,
            };
        }

        return {
            ...input,
            isError: true,
            reason: `'${text}' was not found at index ${input.index}`,
        };
    }

    return input;
}

/**
 * Creates a regular expression Parser based on the supplied RegExp
 * @param matcher The regular expression instance
 */
export const regex = (matcher: RegExp): Parser => (input: ParserState): ParserState => {
    if (!input.isError) {
        const matches = input.current().match(matcher)
        if (!matches) {
            return {
                ...input,
                isError: true,
                reason: `the pattern '/${matcher.source}/' did not match at index ${input.index}`
            }
        }

        const match = matches[0]
        return {
            ...input,
            match,
            index: input.index + match.length,
            lineIndex: input.lineIndex + 1,
        }
    }

    return input;
}

/**
 * Matches the end of the input (EOF)
 */
export const eof = () => (input: ParserState) => {
    if (!input.isError) {
        if (input.index === input.source.length) {
            return input
        }

        return {
            ...input,
            isError: true,
            reason: `index ${input.index} is not EOF`
        }
    }
    return input;
}

const whitespaceMatcher = regex(/^\s+/)
/**
 * Matches one or more whitespace characters
 */
export const whitespace = () => {
    return (input: ParserState): ParserState => whitespaceMatcher(input)
}

const alphaNumericMatcher = regex(/^[a-zA-Z0-9]+/)
/**
 * Matches letters and digits (but not a dot)
 */
export const alphanumeric = () => {
    return (input: ParserState): ParserState => alphaNumericMatcher(input)
}

const integerMatcher = regex(/^\d+/)
/**
 * Matches integer numbers
 */
export const integer = () => {
    return (input: ParserState): ParserState => integerMatcher(input)
}

const floatMatcher = regex(/^\d+(\.\d+)?/)
/**
 * Matches decimal numbers
 */
export const float = () => {
    return (input: ParserState): ParserState => floatMatcher(input)
}

const eolMatcher = regex(/^[\n\r]{1,2}/)
/**
 * Matches any end-of-line explicitly
 */
export const lineEnding = () => {
    return (input: ParserState): ParserState => {
        const result = eolMatcher(input)
        if (result.isError) {
            return {
                ...result,
            }
        }

        return {
            ...result,
            line: input.line + 1,
            lineIndex: 0,
        }
    }
}