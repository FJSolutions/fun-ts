import type { Failure, Result, Success } from "./types";
import { isNullOrUndefined } from "../utils";

export const success = <T>(value: T): Success<T> => ({
   kind: "Result",
   type: "Success",
   value,
})

export const failure = <E = undefined>(message: string, error?: E): Failure<E> => ({
   kind: "Result",
   type: "Failure",
   message,
   error: error as E,
})

export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> =>
   result.kind === "Result" && result.type === "Success" && !isNullOrUndefined((result as Success<T>).value)

export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> =>
   result.kind === "Result" && result.type === "Failure"

export const orElse = <T>(defaultValue: T) => <E>(result: Result<T, E>): T =>
   isSuccess(result) ? result.value : defaultValue

export const map = <T, U>(fn: (value: T) => U) => <E>(result: Result<T, E>): Result<U, E> =>
   isSuccess(result) ? success(fn(result.value)) : result

export const flatMap = <T, U, E>(fn: (value: T) => Result<U, E>) => (result: Result<T, E>): Result<U, E> =>
   isSuccess(result) ? fn(result.value) : result

export const filter = <T>(predicate: (value: T) => boolean, message: string) => <E>(result: Result<T, E>): Result<T, E> =>
   !isSuccess(result) ? result : predicate(result.value) ? result : failure(message) as Result<T, E>

export const reduce = <T, R>(fn: (acc: R, value: T) => R, initial: R) => <E>(result: Result<T, E>): R =>
   isSuccess(result) ? fn(initial, result.value) : initial

export const match = <T, U, E>(
   onSuccess: (value: T) => U,
   onFailure: (message: string, error: E) => U
) => (result: Result<T, E>): U =>
   isSuccess(result) ? onSuccess(result.value) : onFailure(result.message, result.error)

/**
 * Safely creates a Result from a thunk
 * @param fn The thunk to call to generate a Result
 */
export const from = <T>(fn: () => T): Result<T, Error> => {
   try {
      return success(fn())
   } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      return failure(err.message, err)
   }
}
