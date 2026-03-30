# fun-ts

A personal project, grouping the most Functional Programming types & functions I use regularly in one place.

The functions in this library prefer arrow functions because of their inability to change the `this` context.  

## Contents

- [Pipe](#pipe)
- [Option](#option)
- [Sequence](#sequence)
- [General](#general)

## Pipe

A general purpose function for chaining other functions together in pa pipeline.

## Option

A data structure with related functions for handling optional values safely.

## Sequence

A lazily iterated set of functions.

## General

Some general functions that can be used everywhere.

### `id`

The identity function which simply returns its value without doing anything to it.

```ts
const id = <T>(x: T): T => x;
```
