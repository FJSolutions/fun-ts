# fun-ts

A personal project, grouping the most Functional Programming types & functions I use regularly in one place.

The functions in this library prefer arrow functions because of their inability to change the `this` context.

After implementing the core types as structured object type objects and convention based functions (the more traditional
FP approach &ndash; and less JS/TS native approach), the decision was made to move everything to classes and interfaces
so that pipe can be replaced with method chaining.

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

A data structure for representing values that can be absent, with related methods for handling optional values safely.

## Result

A data structure representing the result of an operation that can fail with some kind of context information.

## Sequence

A lazily iterated object which can be lazily chained together through its methods.

## Pipe

General purpose functions for chaining functions together into a pipeline.

- `pipe`
- `accumilate`

## General

General purpose functions for use with the library.

### `id`

The identity function which simply returns its value without doing anything to it.

```ts
const id = <T>(x: T): T => x;
```

### `lazy`

A function for lazily constructing a value once, caching it, and thereafter returning the cached value.

## Strings

A module of functions for transforming strings, including some convenience functions for casing.

## Numbers

A module that wraps the numeric parsing functions in `Option` or `Result`s.

## Documentation

[`fun-ts` documentation]
