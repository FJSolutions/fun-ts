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

### Modules

- **`pipe.ts`** — Top-level `pipe(value, ...fns)` for function composition. Has 9 overload signatures for type-safe chaining up to 9 transforms.

- **`option.ts`** — `Option<T>` monad (`Some<T> | None<T>`). 
methods: `isSome`/`isNone` guards, `map`, `flatMap`, `match`, `orElse`, `apply`, `filter`, `fold`   
functions: `some`, `none`, `lift` (elevates `A => B | null | undefined` to `Option<A> => Option<B>`), `toResult`

- **`result.ts`** — `Result<T>` monad (`Ok<T> | Failure`). 
methods `isSuccess`, `isFailure`, `map`, `flatMap`, `match`, `orElse`, `filter`, `fold`   
functions: `lift`, `success`, `failure`, `toOption`

- **`index.ts`** — Lazy `Seq<T>` iterable sequences. Operations (`map`, `filter`, `flatMap`, `take`/`limit`, `skip`/`offset`, `fold`, `tap`) are lazy until `.toList()` is called. Also has a `pipe` function for composing sequence operations.

- **`strings.ts`** — String case conversion utilities: `toPascal`, `toCamel`, `toSnake`, `toKebab`, `capitalise`, `toSentence`, `toUpper`, `toLower`. Relies on `Intl.Segmenter` for word splitting.

- **`numbers.ts`** — Safe string-to-number parsing. Exported as `N` namespace.  
functions: `toIntOption`, `toFloatOption` (return `Option<number>`), `toIntResult`, `toFloatResult` (return `Result<number>`)

- **`general.ts`** — General-purpose utilities exported at the top level.  
functions: `id` (identity — returns its argument unchanged), `lazy` (wraps a factory in a cached lazy loader, exposing a `.value` getter)

- **`recursion.ts`** — Safe iterative recursion. Not exported from `index.ts`.  
function: `recurse(source, accumulator, predicate, processor, config?)` — loops `processor` until `predicate` returns false, throwing `RecursionError` if `depth` (default 100) is exceeded.  
types: `RecursionConfiguration`, `RecursionState<T, R>`

- **`types.ts`** — Shared functional interfaces used internally across modules. Not exported from `index.ts`.  
types: `Kind`, `Kinds`, `Functor<T>`, `Applicative<T>`, `Monad<T>`, `Predicate<T>`, `Filterable<T>`, `Foldable<T>`

- **`utils.ts`** — Internal helpers: `isNullOrUndefined`, `toWordList`, `toIdentifierWordList`.

### Key Patterns

- **Chaining** - chainable instance methods on classes implementing functional interfaces
- **Arrow functions only** — limited `function` declarations.
- **Lazy sequences** — `Seq<T>` operations build an iterator chain; nothing is evaluated until `.toList()` or iteration.
- **9-arity pipe overloads** — `pipe` and the module-level `pipe` helpers on `option` and `sequence` are all overloaded up to 9 parameters for strong type inference.
- **Strict TypeScript** — `strict: true`, `noUncheckedIndexedAccess: true`, `verbatimModuleSyntax: true`. No implicit `any`, no unchecked array access.
- **No runtime dependencies** — dev-only deps (`vitest`, `oxlint`).
