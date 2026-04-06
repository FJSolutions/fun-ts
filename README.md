# fun-ts

A personal project, grouping the most Functional Programming types & functions I use regularly in one place.

The functions in this library prefer arrow functions because of their inability to change the `this` context.

After implementing the core types as structured object type objects and convention based functions (the more traditional
FP approach &ndash; and less JS/TS native approach), the decision was made to move everything to classes and interfaces
so that pipe can be replaced with method chaining.

## Contents

- [Option](#option)
- [Result](#result)
- [Pipe](#pipe)
- [Sequence](#sequence)
- [General](#general)
- [Strings](#strings)
- [Numbers](#numbers)
- [Documentation](#documentation)

## Option

A data structure with related functions for handling optional values safely.

## Result

A data structure and related functions that represents the result of an operation that can fail with some kind of
context information.

## Pipe

General purpose functions for chaining other functions together into a pipeline.

- `pipe`
- `accumilate`

## Sequence

A lazily iterated set of functions.

## General

Some general functions that can be used everywhere.

### `id`

The identity function which simply returns its value without doing anything to it.

```ts
const id = <T>(x: T): T => x;
```
### `lazy`

A function for constructing a value once, caching it, and then returning the cached value. 


## Strings

A module for converting strings in a more functional way, including some convenience methods for casing.

## Numbers

A module that wraps the numeric parsing functions in `Option` or `Result`s.

## Documentation

[`fun-ts` documentation]
