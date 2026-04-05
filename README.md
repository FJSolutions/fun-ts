# fun-ts

A personal project, grouping the most Functional Programming types & functions I use regularly in one place.

The functions in this library prefer arrow functions because of their inability to change the `this` context.

After implementing the core types as structured object type objects and convention based functions,
the decision was made to move everything to classes and interfaces so that pipe can be replaced with method chaining.

## Contents

- [Pipe](#pipe)
- [Option](#option)
- [Sequence](#sequence)
- [Result](#result)
- [General](#general)
- [Strings](#strings)
- [Numbers](#numbers)
- [Documentation](#documentation)

## Pipe

A general purpose function for chaining other functions together in pa pipeline.

- `pipe`
- `do`

## Option

A data structure with related functions for handling optional values safely.

## Sequence

A lazily iterated set of functions.

## Result

A data structure and related functions that represents the result of an operation that can fail with some kind of
context information.

## General

Some general functions that can be used everywhere.

### `id`

The identity function which simply returns its value without doing anything to it.

```ts
const id = <T>(x: T): T => x;
```

## Strings

A module for converting strings in a more functional way, including some convenience methods for casing.

## Numbers

A module that wraps the numeric parsing functions in `Option` or `Result`s.

## Documentation

[`fun-ts` documentation]
