# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Scaffolded out a basic parser-combinator library
  - `str`
  - `regex`
  - `eol`
  - `eof`
  - `sequenceOf`
- Added tests for them

## [0.7.0] - 2026-04-22

### Added

- Added an `FP` (Functional Programming) module and added new 'thin' `Option`,
  `Result` and `Sequence` types with accompanying functions
- Created a new set of tests in an FP folder to cover the new implementation.
- A build & publish task: `bun run build` 

### Changed

- Moved the existing `Option`, `Result`, and `Sequence` modules into an `OF` (
  Object/Functional) module.
- Moved their tests into a parallel folder
- Renamed the pipe module's `accumulator` to just `accumulate`
- Removed the `esbuild` and moved to `tsup`; replaced the `tsconfig.json`

## [0.6.0] - 2026-04-17

### Added

- Refactored `option` and `result` into their own folders and extracted the
  transformer methods into their own module.
- An initial implementation of a `recurse` function for safer recursion

## [0.5.0] - 2026-04-06

This release is a breaking change to the API of the library to facilitate a
change in methodology to embrace the more
object/functional nature of TypeScript/JavaScript; that is, to have a public
interface that esposes a private class
implementation.

### Added

- `Filterable` and `Foldable` interfaces to the `types` module.
- Implemented `Filterable` and `Foldable` on `Option` and `Result`

### Changed

- Extraction of common traits into independent interfaces
- Completed reimplementation of Option to use a public interface and a private
  class implementation
- Also complete reimplementation of Result to use a public interface and a
  private class implementation
- Renamed the `Do` function to `accumulate`, and added the ability to pass in an
  optional initial state.
- Completed the refactoring of Index to use a public interface and a private
  class implementation

## [0.4.0] - 2026-04-04

### Changed

- The result type variants are now `Success` and `Failure`; the `OK` labels and
  identifiers have been changed to
  `Success`, and also for `Error` to `Failure`

## [0.3.0] - 2026-04-04

### Added

- `Do` notation to the `pipe` module

## [0.2.0] - 2026-04-02

### Added

- Transformation methods to `Option` and `Result` to convert from one to the
  other.
- A `numbers` module that wraps the native parsing methods.

## [0.1.0] - 2026-03-31

### Added

- General
   - `id`
- Pipe
   - Generic, strongly typed, function piping function (1 to 9 function
     parameters)
- Sequence
   - `Seq` interface
   - `map`, `filter`, `reduce`, `flatMap`, `take`/`limit`, `skip`/`offset`
     functions
- Option
   - `Option` interface
   - `of`, `some`, `none`, `isSome`, `isNone`, `orElse`, `lift`, `match` utility
     functions
   - `match` & `pipe` functions
- Result
   - `Result` interface
   - `of`, `ok`, `failure`, `isOk`, `isFailure`, `orElse`, `lift`, `match`
     utility functions
   - `match` & `pipe` functions
- Strings
   - Case conversion methods
      - `toUpper`
      - `toLower`
      - `capitalise`
      - `toSentence`
      - `toPascal`
      - `toCamel`
      - `toKebab`
      - `toSnake`

### Changed

- Update the way that the `pipe` functions implementation works in `option`,
  `pipe`, and `sequence`
