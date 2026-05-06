# `fun-ts` Functional Programming (FP)

This module contains implementations of common Functional Programming (FP) types using a thin object literal and
function approach.

## TODO

- Customize this for the Functional Programming implementation 

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

### Transformers

An extended `Option` that also includes transformation methods.

## Result

A data structure representing the result of an operation that can fail with some
kind of context information. (The `Either` monad in Haskell)

### Transformers

An extended `Result` that also includes transformation methods.

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
