import {
    anyChar,
    choice,
    float,
    lazy,
    manyTill,
    map,
    optional,
    right,
    sepBy,
    sequenceOf,
    str,
    whitespace
} from "../../src/PC";
import type {Parser} from "../../src/PC";

const discardWhitespace = map(optional(whitespace()), _ => "")

const string = right(
    str("\""),
    map(manyTill(anyChar(), str("\"")), chars => chars.join(""))
)

const bool = choice([str("true"), str("false")])

/**
 * Forward declaration — resolved to _valueParser once all parsers are initialised
 *
 * `lazy` defers parser construction to call time. It takes () => Parser<T> — a factory — and returns a Parser<T>
 *  that calls the factory on every parse attempt. This breaks the circular dependency at the JavaScript module level.
 */
const valueParser: Parser<string> = lazy(() => _valueParser)

const member = map(
    sequenceOf([
        discardWhitespace,
        string,
        discardWhitespace,
        str(":"),
        discardWhitespace,
        valueParser,
        discardWhitespace,
    ]),
    arr => arr.join("")
)

const objectParser = map(
    sequenceOf([
        str("{"),
        discardWhitespace,
        map(sepBy(member, str(",")), arr => arr.join(",")),
        discardWhitespace,
        map(optional(str(",")), _ => ""),
        str("}")
    ]),
    arr => arr.join("")
)

const arrayParser = map(
    sequenceOf([
        str("["),
        discardWhitespace,
        map(
            sepBy(
                valueParser,
                map(sequenceOf([discardWhitespace, str(","), discardWhitespace]), _ => "")
            ),
            arr => arr.join(",")
        ),
        discardWhitespace,
        map(optional(str(",")), _ => ""),
        discardWhitespace,
        str("]")
    ]),
    arr => arr.join("")
)

// Full implementation referenced by the lazy valueParser above
const _valueParser: Parser<string> = choice([
    objectParser,
    arrayParser,
    float(),
    string,
    bool,
    str("null")
])

export const jsonParser: Parser<string> = choice([objectParser, arrayParser])
