# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm test           # Run all tests (Vitest)
pnpm test -- --run  # Run tests once (no watch mode)
pnpm lint           # Lint with Oxlint
pnpm lint:fix       # Auto-fix lint issues
pnpm build          # Builds the sources with type definition files to the dist folder
pnpm clean          # Removes the dist folder, if present
```

To run a single test file:
```bash
pnpm test tests/sequence.tests.ts
```
## Architecture

**fun-ts** is a personal functional programming library. All public APIs are re-exported from `src/index.ts`.

The library has three top-level modules under `src/`, each taking a distinct approach:

- **`src/OF/`** — Object/Functional style. Class-based smart objects with chainable functional methods. Exported as the `OF` namespace (`OF.O`, `OF.Seq`, `OF.R`).
- **`src/FP/`** — Functional/Plain style. The same domain types (`Option`, `Result`, `Sequence`) reimagined as thin plain object literals with standalone functions and no class instances.
- **`src/PC/`** — Parser Combinators. A parser-combinator library using the same thin-type-and-function approach as `FP`. Parsers are plain functions `(ParserState) => ParserState`; combinators compose them.

### Top-level modules

- **`pipe.ts`** — Top-level `pipe(value, ...fns)` for function composition. Has 9 overload signatures for type-safe chaining up to 9 transforms.

- **`strings.ts`** — String case conversion utilities: `toPascal`, `toCamel`, `toSnake`, `toKebab`, `capitalise`, `toSentence`, `toUpper`, `toLower`. Relies on `Intl.Segmenter` for word splitting.

- **`numbers.ts`** — Safe string-to-number parsing. Exported as `N` namespace.  
functions: `toIntOption`, `toFloatOption` (return `Option<number>`), `toIntResult`, `toFloatResult` (return `Result<number>`)

- **`general.ts`** — General-purpose utilities exported at the top level.  
functions: `id` (identity — returns its argument unchanged), `lazy` (wraps a factory in a cached lazy loader, exposing a `.value` getter)

- **`recursion.ts`** — Safe iterative recursion. Not exported from `index.ts`.  
function: `recurse(source, accumulator, predicate, processor, config?)` — loops `processor` until `predicate` returns false, throwing `RecursionError` if `depth` (default 100) is exceeded.  
types: `RecursionConfiguration`, `RecursionState<T, R>`

- **`utils.ts`** — Internal helpers: `isNullOrUndefined`, `toWordList`, `toIdentifierWordList`.

### `src/OF/` — Object/Functional modules

- **`OF/option/`** — `Option<T>` monad (`Some<T> | None<T>`).  
methods: `isSome`/`isNone` guards, `map`, `flatMap`, `match`, `orElse`, `apply`, `filter`, `fold`  
functions: `some`, `none`, `lift` (elevates `A => B | null | undefined` to `Option<A> => Option<B>`), `toResult`

- **`OF/result/`** — `Result<T>` monad (`Ok<T> | Failure`).  
methods: `isSuccess`, `isFailure`, `map`, `flatMap`, `match`, `orElse`, `filter`, `fold`  
functions: `lift`, `success`, `failure`, `toOption`

- **`OF/sequence/`** — Lazy `Seq<T>` iterable sequences. Operations (`map`, `filter`, `flatMap`, `take`/`limit`, `skip`/`offset`, `fold`, `tap`) are lazy until `.toList()` is called. Also has a `pipe` function for composing sequence operations.

- **`OF/types.ts`** — Shared functional interfaces used internally across OF modules.  
types: `Kind`, `Kinds`, `Functor<T>`, `Applicative<T>`, `Monad<T>`, `Predicate<T>`, `Filterable<T>`, `Foldable<T>`

### `src/FP/` — Functional/Plain modules (in progress)

- **`FP/option.ts`** — `Option<T>` as a plain object literal (`{ kind, type, value? }`).  
functions: `some`, `none`

- **`FP/types.ts`** — Shared type definitions for the FP style.  
types: `Kind`, `Option<T>`

### `src/PC/` — Parser Combinator modules

- **`PC/types.ts`** — Core types.  
  types: `Success<T>` (`{ tag: "success", source, index, lineNumber, lineIndex, current(), match: T }`), `Failure` (`{ tag: "failure", source, index, lineNumber, lineIndex, reason }`), `ParserState<T>` (`Success<T> | Failure`), `Parser<T>` (`(input: ParserState<unknown>) => ParserState<T>`)

- **`PC/basic-parsers.ts`** — Primitive parsers, all typed as `Parser<string>`.  
  functions: `str(text)`, `regex(matcher)` (pattern must be anchored with `^`), `eof()`, `whitespace()`, `alphanumeric()`, `integer()`, `float()`, `lineEnding()` (increments `lineNumber`, resets `lineIndex`)

- **`PC/parser-combinators.ts`** — Combinators that compose parsers.  
  functions: `sequenceOf<T>(parsers)` → `Parser<Success<T>[]>`; `map<A,B>(parser, fn)` → `Parser<B>`; `choice<T>(parsers)` → `Parser<T>` (first match wins, deepest failure); `optional<T>(parser)` → `Parser<T | null>`; `left<A,B>(a, b)` → `Parser<A>`; `right<A,B>(a, b)` → `Parser<B>`; `between<O,T,C>(open, parser, close)` → `Parser<T>`; `sepBy1<T,S>(parser, sep)` → `Parser<T[]>` (one or more); `sepBy<T,S>(parser, sep)` → `Parser<T[]>` (zero or more); `many<T>(parser)` → `Parser<T[]>` (zero or more, always succeeds); `many1<T>(parser)` → `Parser<T[]>` (one or more); `manyTill<T,E>(parser, terminator)` → `Parser<T[]>` (until terminator, which is consumed); `label<T>(parser, name)` (replaces failure reason with `expected <name>`)

- **`PC/function-parsers.ts`** — Runner utilities.  
  functions: `run<T>(parser, source)` → `ParserState<T>`, `formatError(failure)` (renders a human-readable error with the source line and a caret at the failure column)

- **`PC/index.ts`** — Re-exports everything including types (`export type * from "./types"`).

### Key Patterns

- **OF style** — chainable instance methods on classes implementing functional interfaces
- **FP style** — thin plain object literals; all operations are standalone functions
- **PC style** — same thin-type-and-function approach as FP; parsers are plain `Parser<T>` functions `(ParserState<unknown>) => ParserState<T>`
- **Arrow functions only** — limited `function` declarations.
- **Lazy sequences** — `Seq<T>` operations build an iterator chain; nothing is evaluated until `.toList()` or iteration.
- **9-arity pipe overloads** — `pipe` and the module-level `pipe` helpers on `option` and `sequence` are all overloaded up to 9 parameters for strong type inference.
- **Strict TypeScript** — `strict: true`, `noUncheckedIndexedAccess: true`, `verbatimModuleSyntax: true`. No implicit `any`, no unchecked array access.
- **No runtime dependencies** — dev-only deps (`vitest`, `oxlint`).

## Other documents

- [Parser Combinators](docs/parser-combinators.md)
- 
