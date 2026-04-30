import {isNullOrUndefined} from "../utils";
import type {Failure, Parser, ParserState, Success} from "./types";

export const run = <T>(parser: Parser<T>, source: string): ParserState<T> => {
    const initial: Success<string> = {
        tag: "success",
        source: isNullOrUndefined(source) ? "" : source,
        index: 0,
        lineNumber: 1,
        lineIndex: 0,
        match: "",
        current() {
            return this.source.slice(this.index);
        }
    }
    return parser(initial)
}

export const formatError = (failure: Failure): string => {
    const lineStart = failure.source.lastIndexOf('\n', failure.index - 1) + 1
    const lineEnd = failure.source.indexOf('\n', failure.index)
    const line = failure.source.slice(lineStart, lineEnd === -1 ? undefined : lineEnd)
    const column = failure.index - lineStart
    return [
        `Parse error on line ${failure.lineNumber}, column ${column + 1}: ${failure.reason}`,
        `  ${line}`,
        `  ${' '.repeat(column)}^`
    ].join('\n')
}
