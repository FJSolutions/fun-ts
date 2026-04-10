# fun-ts

Why `fun-ts`?
Because TypeScript is fun, and functional programming in TypeScript should and
can be fun too.

This is a personal project which I used, initially, to understand how to
use claude-code for development, refactoring, and testing. It was a huge
success for me, I believe, because I already kew what I wanted to do and how
I wanted it implemented.

The project is a group of common Functional Programming types & functions that I
like to use regularly, with a full coverage set of tests.

After implementing the core types as structured objects and
convention-based functions (the more traditional FP approach &ndash; but less
JS/TS native approach), I made the decision to move everything to use public
interfaces with private class implementations. This changed piping over independent
functions to method chaining of objects &ndash; a much more intuitive
object/functional design.

After trying to recreate a monadic hierarchy of TypeScript interfaces but being
frustrated by the lack of Higher Kinded Type support in the TypeScript type
system, I elected to make the interfaces independent. Thus, my `Monad<T>`
interface is not an `Applicative<T>` or even a `Functor<T>`! This is the kind of
tradeoff that I have seen in other hybrid Object/Functional languages for implementing
FP patters.

I also confess to my influence by the F# programming language and it's implementation of
the Functional paradigm in an Object framework (.NET).

## Contents

- [Option](#option)
- [Result](#result)
- [Sequence](#sequence)
- [Pipe](#pipe)
- [General](#general)
- [Strings](#strings)
- [Numbers](#numbers)
- [Documentation](#documentation)

## Option

A data structure for representing values that can be absent, with related
methods for handling optional values safely. (The `maybe` monad of Haskell)

## Result

A data structure representing the result of an operation that can fail with some
kind of context information. (The `Either` monad in Haskell)

## Sequence

A lazily iterated object which can be lazily chained together through its
methods.

## Pipe

General purpose functions for chaining functions together into a pipeline.

- `pipe`
- `accumilate`

## General

General purpose functions for use with the library.

### `id`

The identity function which simply returns its value without doing anything to
it.

```ts
const id = <T>(x: T): T => x;
```

### `lazy`

A function for lazily constructing a value once, caching it, and thereafter
returning the cached value.

## Strings

A module of functions for transforming strings, including some convenience
functions for casing.

## Numbers

A module that wraps the numeric parsing functions in `Option` or `Result`s.

## Documentation

[`fun-ts` documentation]
