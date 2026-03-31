# fun-ts

A personal project, grouping the most Functional Programming types & functions I use regularly in one place.

The functions in this library prefer arrow functions because of their inability to change the `this` context.  

## Contents

- [Pipe](#pipe)
- [Option](#option)
- [Sequence](#sequence)
- [Result](#result)
- [General](#general)
- [String](#strings)

## Pipe

A general purpose function for chaining other functions together in pa pipeline.

## Option

A data structure with related functions for handling optional values safely.

## Sequence

A lazily iterated set of functions.

## Result

A data structure and related functions that represents the result of an operation that can fail with some kind of context information.

## General

Some general functions that can be used everywhere.

### `id`

The identity function which simply returns its value without doing anything to it.

```ts
const id = <T>(x: T): T => x;
```
## Strings

A module for converting strings in a more functional way, including some convenience methods for casing.

## Documentation

[`fun-ts` documentation]
