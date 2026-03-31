/*
 * Funcitons to implement
 *
 * - of
 * - try
 * - map
 * - filter
 * - reduce
 * - lift
 * - pipe
 */

interface Ok<T> {
   key: "OK",
   value: T
}

interface Failure {
   key: "Failure",
   error: Error
}

export type Result<T> = Ok<T> | Failure;

export const ok = <T>(value: T): Result<T> => ({key: "OK", value})

export const failure = <T>(message: string): Result<T> => ({key: "Failure", error: Error(message)})

export const of = <T>(func: () => T): Result<T> => {
   try {
      const result = func()
      return ok(result)
   } catch (ex) {
      return {
         key: "Failure",
         error: ex as Error,
      }
   }
}
