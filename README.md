# fun-ts

Why `fun-ts`?
Because TypeScript is fun, and functional programming in TypeScript and and
should be fiun too.

This is a personal project, which I initially to understand how to efficiently
use claude-code for development, refactoring, and testing; and was a huge
success because I already kew what I wanted to do and how I wanted it
implemented.

The project is a group of common Functional Programming types & functions that I
like to use regularly, with a full coverage test suite.

After implementing the core types as structured object type objects and
convention based functions (the more traditional FP approach &ndash; and less
JS/TS native approach), I made the decision to move everything to use public
interfaces with private class implementations, so that piping over independent
functions is replaced with method chaining &ndash; a much more intuitive
object/functional design.

After trying to recreate a monadic hierarchy of TypeScript interfaces but being
frustrated by the lack of Higer Kinded Type support in the TypeScript type
system, I elected to make the interfaces independant. Thus, my `Monad<T>`
interface is not an `Applicative<T>` or even a `Functor<T>`! This is the kind of
tradeoff that I have seen in other langages and implementaitons of FP patters.

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
kind of context information.

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
