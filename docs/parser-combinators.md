# Parser Combinators

The `src/PC/` directory contains a parser-combinator library. Parsers are plain functions `Parser<T>` — they consume input by advancing an index and produce a typed match value, or return a `Failure`. Combinators compose parsers into more complex ones.

## Core Types

`ParserState<T>` is a tagged union — a parse operation produces either a `Success<T>` or a `Failure`. The type parameter `T` is the type of the match value: `string` for basic parsers, `Success<T>[]` for `sequenceOf`, and anything else after `map`.

### `Success<T>`

```ts
type Success<T> = {
    readonly tag: "success"
    readonly source: string        // the full input string
    readonly index: number         // current position in source
    readonly lineNumber: number    // current line number (1-based)
    readonly lineIndex: number     // count of matches on the current line
    readonly current: () => string // source.slice(index) — remaining input
    readonly match: T              // the typed match value
}
```

### `Failure`

```ts
type Failure = {
    readonly tag: "failure"
    readonly source: string        // the full input string (for error display)
    readonly index: number         // position where parsing failed
    readonly lineNumber: number    // line number at the point of failure
    readonly lineIndex: number     // match count on the line at the point of failure
    readonly reason: string        // description of what went wrong
}
```

### `ParserState<T>` and `Parser<T>`

```ts
type ParserState<T> = Success<T> | Failure

// Parsers never read input.match, so the input type is ParserState<unknown>
type Parser<T> = (input: ParserState<unknown>) => ParserState<T>
```

A `Parser<T>` is a function. If `input.tag === "failure"`, every parser returns it unchanged — failures propagate automatically so combinators can chain parsers without checking each intermediate result.

## Running a Parser

### `run<T>(parser, source)`

Constructs an initial `Success<string>` state from a source string and executes the parser. Returns `ParserState<T>`.

```ts
import { run, str } from "./PC"

const result = run(str("hello"), "hello world")
// result.tag   === "success"
// result.match === "hello"   (type: string)
// result.index === 5
```

## Error Display

### `formatError(failure)`

Renders a human-readable error with the source line and a caret pointing to the column where parsing failed.

```ts
import { run, sequenceOf, str, formatError } from "./PC"

const result = run(sequenceOf([str("Hello"), str("World")]), "HelloXarth")
if (result.tag === "failure") {
    console.error(formatError(result))
}
```

Output:
```
Parse error on line 1, column 6: 'World' was not found at index 5
  HelloXarth
       ^
```

## Basic Parsers

All basic parsers are zero-argument factories (e.g. `whitespace()`) or single-argument factories (e.g. `str("x")`). They all return `Parser<string>`.

### `str(text)`

Matches a literal string at the current position. Fails with `'<text>' was not found at index <n>`, or `"EOF"` if the remaining input is shorter than the text.

### `regex(matcher)`

Matches a `RegExp` at the current position. **The pattern must be anchored with `^`** — it is applied against `current()` (the remaining input from the current index). Fails with `the pattern '/<source>/' did not match at index <n>`.

### `eof()`

Matches end of input (`index === source.length`). Returns `match: ""` on success.

### `whitespace()`

Matches one or more whitespace characters (`/^\s+/`).

### `alphanumeric()`

Matches one or more letters or digits (`/^[a-zA-Z0-9]+/`).

### `integer()`

Matches one or more decimal digits (`/^\d+/`).

### `float()`

Matches a decimal number, optionally with a fractional part (`/^\d+(\.\d+)?/`).

### `lineEnding()`

Matches `\n`, `\r`, or `\r\n`. On success, increments `lineNumber` and resets `lineIndex` to `0`.

## Combinators

### `sequenceOf<T>(parsers)`

Runs a homogeneous list of `Parser<T>` in order. Returns `Parser<Success<T>[]>` — one `Success<T>` entry per parser, preserving each sub-parser's full state. Returns the first `Failure` encountered.

```ts
import { run, sequenceOf, str, whitespace, integer } from "./PC"

const result = run(sequenceOf([str("count"), whitespace(), integer()]), "count 42")
// result.tag          === "success"
// result.match        is Success<string>[]
// result.match[0].match === "count"
// result.match[1].match === " "
// result.match[2].match === "42"
// result.index        === 8
```

### `map<A, B>(parser, fn)`

Transforms the match value of a successful parse. Failures pass through without calling `fn`. Returns `Parser<B>`.

```ts
import { run, map, integer, sequenceOf, str, whitespace } from "./PC"

// Basic transformation
const number = map(integer(), s => parseInt(s, 10))  // Parser<number>
const result = run(number, "42")
// result.match === 42

// Extracting a typed value from sequenceOf
const countParser = map(
    sequenceOf([str("count"), whitespace(), integer()]),
    matches => parseInt(matches[2]!.match, 10)
)                                                     // Parser<number>
const r = run(countParser, "count 42")
// r.match === 42
```

### `choice<T>(parsers)`

Tries each `Parser<T>` in order from the same starting position. Returns the first `Success<T>`. If all fail, returns the `Failure` that got furthest into the input (most informative error). Returns a `"no alternatives provided"` failure for an empty array.

```ts
import { run, choice, str } from "./PC"

const animal = choice([str("cat"), str("dog"), str("fish")])

run(animal, "dog").match   // "dog"
run(animal, "fish").match  // "fish"
run(animal, "bird").tag    // "failure"
```

Composes naturally with `map` to normalise alternatives:

```ts
const bool = map(choice([str("true"), str("false")]), s => s === "true")
// Parser<boolean>
```

### `optional<T>(parser)`

Wraps a `Parser<T>` so that failure becomes `Success<null>` at the original position. Never fails. Returns `Parser<T | null>`.

```ts
import { run, optional, sequenceOf, str } from "./PC"

// With optional content absent
run(
    sequenceOf([str("Hello"), optional(str(",")), str(" World")]),
    "Hello World"
).match[1]!.match   // null

// With optional content present
run(
    sequenceOf([str("Hello"), optional(str(",")), str(" World")]),
    "Hello, World"
).match[1]!.match   // ","
```

Composes with `map` to supply a default value:

```ts
const withDefault = map(optional(integer()), s => s !== null ? parseInt(s, 10) : 0)
// Parser<number> — always succeeds
```

## Error Handling

After `run`, narrow on `tag` to access variant-specific fields:

```ts
const result = run(parser, input)
if (result.tag === "failure") {
    console.error(formatError(result))
} else {
    console.log(result.match)  // type is T
}
```

### `left<A, B>(a, b)`

Runs both parsers in order. Returns A's match at B's final position. Fails if either parser fails. Useful for consuming a trailing token without including it in the result.

```ts
left(integer(), str("px"))   // Parser<string> — matches "42px", match is "42"
```

### `right<A, B>(a, b)`

Runs both parsers in order. Returns B's result. Fails if either parser fails. Useful for consuming a leading token without including it in the result.

```ts
right(str("count "), integer())   // Parser<string> — matches "count 42", match is "42"
```

### `between<O, T, C>(open, parser, close)`

Runs all three parsers in order and returns the middle parser's match. Fails if any of the three fail.

```ts
between(str("("), integer(), str(")"))   // Parser<string> — matches "(42)", match is "42"
```

Composes with `sepBy` for bracketed lists:

```ts
between(str("("), sepBy(integer(), str(",")), str(")"))
// "(1,2,3)" → match: ["1","2","3"]
// "()"      → match: []
```

### `sepBy1<T, S>(parser, separator)`

Matches one or more occurrences of `parser` separated by `separator`. Returns `Parser<T[]>`. Separator match values are discarded. The separator is only consumed when the subsequent parser also succeeds, so trailing separators are never consumed. Fails if the parser does not match at least once.

```ts
sepBy1(integer(), str(","))
// "1,2,3"  → match: ["1","2","3"]
// "1,2,"   → match: ["1","2"], index stops before trailing comma
// "abc"    → failure
```

### `sepBy<T, S>(parser, separator)`

Like `sepBy1` but accepts zero occurrences. Always succeeds, returning `[]` when nothing matches.

```ts
sepBy(integer(), str(","))
// "1,2,3"  → match: ["1","2","3"]
// ""        → match: []
// "abc"    → match: [], index stays at 0
```

### `label<T>(parser, name)`

Replaces the `reason` of any failure produced by `parser` with `expected <name>`. On success the result is returned unchanged. Use this to replace low-level pattern strings with readable names in error output.

```ts
import { run, label, integer, choice, str, formatError } from "./PC"

const number = label(integer(), "integer")

// Success path — label is invisible
run(number, "42").match   // "42"

// Failure path — raw regex reason replaced by the label
const bad = run(number, "abc")
// bad.reason === "expected integer"
formatError(bad as Failure)
// Parse error on line 1, column 1: expected integer
//   abc
//   ^
```

`label` is most useful with `choice`, where it turns pattern-level failure messages into meaningful alternative names:

```ts
const value = choice([
    label(str("true"),  "boolean"),
    label(str("false"), "boolean"),
    label(integer(),    "integer"),
])
// run(value, "hello").reason === "expected integer"  (deepest failure wins)
```

### `many<T>(parser)`

Matches zero or more occurrences of `parser`. Always succeeds, returning `[]` when nothing matches. Stops when the parser fails or when it succeeds without advancing the index (zero-width guard prevents infinite loops).

```ts
many(str("a"))          // "aaab" → match: ["a","a","a"], index: 3
many(str("a"))          // "bbb"  → match: [], index: 0
```

### `many1<T>(parser)`

Like `many` but requires at least one match. Fails (with the parser's own failure reason) if nothing matches.

```ts
many1(str("a"))         // "aaab" → match: ["a","a","a"]
many1(str("a"))         // "bbb"  → failure
```

Compose with `map` to build strings from character-level parsers:

```ts
map(many1(regex(/^[a-zA-Z]/)), chars => chars.join(""))
// "Hello123" → match: "Hello"
```

### `manyTill<T, E>(parser, terminator)`

Matches `parser` repeatedly until `terminator` succeeds. The terminator is tried *first* on each iteration, so the parser pattern does not need to exclude the terminator character. The terminator is consumed and its match value is discarded; returns `Parser<T[]>` of the content matches. Fails if EOF is reached before the terminator.

```ts
// Parse any character until a closing quote
// regex(/^./) matches quotes too — manyTill handles it by trying str('"') first
manyTill(regex(/^./), str('"'))
// 'Hello"rest' → match: ["H","e","l","l","o"], index: 6 (past the quote)

// Compose with map to join into a string
map(manyTill(regex(/^./), lineEnding()), chars => chars.join(""))
// "Hello\nWorld" → match: "Hello", index: 6
```
