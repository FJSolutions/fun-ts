# fun-ts

Why `fun-ts`?
Because TypeScript is fun, and functional programming in TypeScript should, and
can, be fun too.

This is a personal project which I used, initially, to understand how to
use claude-code for development, refactoring, and testing. It was a huge
success for me, I believe, because I already kew what I wanted to do and how
I wanted it implemented.

The project is a group of common Functional Programming types & functions that I
like to use regularly, with a full coverage set of tests.

After implementing the core types as structured objects and
convention-based functions (the more traditional FP approach &ndash; but less
like the JS/TS native approach), I made the decision to move everything to use
public interfaces with private class implementations. This changed piping over
independent functions to method chaining of objects &ndash; a much more
intuitive object/functional design.

After trying to recreate a monadic hierarchy of TypeScript interfaces but being
frustrated by the lack of Higher Kinded Type support in the TypeScript type
system, I elected to make the interfaces independent. Thus, my `Monad<T>`
interface is not an `Applicative<T>` or even a `Functor<T>`! This is the kind of
tradeoff that I have seen in other hybrid Object/Functional languages for
implementing FP patters.

I also confess to my influence by the F# programming language and it's
implementation of the Functional paradigm in an Object framework (.NET).

## Modules

- [Functional Programming (Option, Result, Sequence)](src/FP/README.md)
- [Object/Functional (Option, Result, Sequence)](src/OF/README.md)
- [Discriminated Unions](src/DU/README.md)
- [Parser & Parser-Combinators](src/PC/README.md)
- Common utilities

### Common utilities

In the root of the project are common utility functions:

- general
	- `id`
	- `lazy`
- numbers
  - Safe parsing functions to `option` and `result`
- pipe
	- `pipe` - pipes a value through a list of single-argument functions
	- `accumulate` - pipes a value through a list of single-argument functions, accumulating previous values in an object
	  that is passed on to successive functions (sometimes called `chain`)
- recursion
- strings
	- Changing of case functions.
- utils
	- `isNullOrUndefined` - strict checking for `null` and `undefined` exclusively.
	- `toWordList` - using the JavaScript `Intl` package to segment the string.
	- `toIdentifierWordList` - converts a string identifier to a list of words that can be converted into an identifier

## Documentation

[`fun-ts` documentation]
