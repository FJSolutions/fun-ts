
import {isNullOrUndefined} from "../utils";
import type {Parser, ParserState} from "./types";

export const run = (parser: Parser, source: string): ParserState => {
    let state: ParserState = {
        source: isNullOrUndefined(source) ? "" : source,
        index: 0,
        line: 1,
        match: "",
        isError: false,
        reason: null,
        current() {
            return this.source.slice(this.index);
        }
    }
    state = parser(state)

    return state
}