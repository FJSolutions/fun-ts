# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-04-04

### Changed

- Teh result type variants are now `Success` and `Failure`, `OK` has been changed to `Success`

## [0.3.0] - 2026-04-04

### Added

- `Do` notation to the `pipe` module

## [0.2.0] - 2026-04-02

### Added

- Transformation methods to `Option` and `Result` to convert from one to the other.
- A `numbers` module that wraps the native parsing methods.

## [0.1.0] - 2026-03-31

### Added

- General
  - `id`
- Pipe
  - Generic, strongly typed, function piping function (1 to 9 function parameters)
- Sequence
  - `Seq` interface
  - `map`, `filter`, `reduce`, `flatMap`, `take`/`limit`, `skip`/`offset` functions
- Option
  - `Option` interface
  - `of`, `some`, `none`, `isSome`, `isNone`, `orElse`, `lift`, `match` utility functions
  - `match` & `pipe` functions
- Result
  - `Result` interface
  - `of`, `ok`, `failure`, `isOk`, `isFailure`, `orElse`, `lift`, `match` utility functions
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

- Update the way that the `pipe` functions implementation works in `option`, `pipe`, and `sequence`
