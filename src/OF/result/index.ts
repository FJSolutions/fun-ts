import type { Filterable, Foldable, Functor, Kind, Kinds, Monad } from "../types";
import { isNullOrUndefined } from "../../utils";

type ResultTypes = "Success" | "Failure";

/**
 * The interface to the Result type
 */
//@ts-ignore
export interface Result<T> extends Kind, Functor<T>, Monad<T>, Filterable<T>, Foldable<T> {
   readonly kind: Kinds;
   /**
    * The type of result that this is
    */
   readonly tag: ResultTypes;
   /**
    * Indicates whether this Result is a success or not
    */
   readonly isSuccess: boolean;
   /**
    * Indicates if this Result is a failure or not
    */
   readonly isFailure: boolean;
   /**
    * Returns the successful value, or the default value if this Result was a failure
    */
   orElse: (defaultValue: T) => T
   /**
    * Maps the value of Result to another Result
    */
   map: <U>(func: (value: T) => U) => Result<U>
   /**
    * Maps a value to another value in this Kind of Result
    */
   flatMap: <U>(func: (value: T) => Result<U>) => Result<U>
   /**
    * Matches this Result's value with a matching function that returns a common type
    * @param success The function to run if the Result is a Success
    * @param failure The function to run if the Result is a Failure
    */
   match: <U>(success: (value: T) => U, failure: (errorMessage: string, error?: Error) => U) => U
   /**
    * Filters the value of this Option based on the supplied predicate
    */
   filter: (func: (value: T) => boolean) => Result<T>
   /**
    * Folds the initial value into the supplied function and returns its result
    * @param func The folder function
    * @param initialValue The initial value to start the folding process off
    */
   fold: <U>(func: (acc: U, value: T) => U, initialValue: U) => Result<U>
}

/** @internal */
export class Either<T> implements Result<T> {
   protected readonly _value: T | undefined = undefined
   protected readonly _errorMessage: string | undefined
   protected readonly _error: Error | undefined

   constructor(
      public readonly kind: Kinds,
      public readonly tag: ResultTypes,
      value: T | undefined,
      errorMessage?: string | undefined,
      error?: Error | undefined
   ) {
      this._value = value
      this._error = error
      this._errorMessage = errorMessage
   }

   match = <U>(success: (value: T) => U, failure: (errorMessage: string, error?: Error) => U): U => {
      if (this.isSuccess && !isNullOrUndefined(this._value)) {
         return success(this._value)
      } else {
         return failure(this._errorMessage ?? "Failure", this._error)
      }
   }


   get isFailure(): boolean {
      return (this.tag === "Failure")
   }

   get isSuccess(): boolean {
      return (this.tag === "Success")
   }

   flatMap<U>(func: (value: T) => Result<U>): Result<U> {
      if (this.isFailure || isNullOrUndefined(this._value)) {
         return failure<U>(this._errorMessage ?? "Failure", this._error)
      }
      return func(this._value)
   }

   map<U>(func: (value: T) => U): Result<U> {
      if (this.isFailure || isNullOrUndefined(this._value)) {
         return failure<U>(this._errorMessage ?? "Failure", this._error)
      }
      return success(func(this._value))
   }

   orElse(defaultValue: T): T {
      if (!isNullOrUndefined(this._value)) {
         return this._value
      } else {
         return defaultValue
      }
   }

   filter = (func: (value: T) => boolean): Result<T> => {
      if (!isNullOrUndefined(this._value) && func(this._value)) {
         return this
      } else {
         return failure(this._errorMessage ?? "This was filtered out", this._error)
      }
   }

   fold = <U>(func: (acc: U, value: T) => U, initialValue: U): Result<U> => {
      if (this.isSuccess && !isNullOrUndefined(this._value)) {
         return success(func(initialValue, this._value))
      } else {
         return failure<U>(this._errorMessage ?? "Failure", this._error)
      }
   }
}

/**
 * Create a Result that has succeeded
 * @param value The value of the successful Result
 */
export const success = <T>(value: T): Result<T> =>
   new Either<T>("Result", "Success", value)

/**
 * Creates a Result that has failed
 * @param errorMessage The error message that explains the failure
 * @param error (Optional) An Error that occurred to cause the failure
 */
export const failure = <T>(errorMessage: string, error?: Error): Result<T> =>
   new Either<T>("Result", "Failure", undefined, errorMessage, error)

/**
 * Lists a value into a result. The value can throw so lift takes the value as the result of a thunk
 * @param func The thunk from which to get the value to list into a Result
 */
export const lift = <T>(func: () => T): Result<T> => {
   try {
      const result = func()
      return success(result)
   } catch (ex) {
      if (ex instanceof Error) {
         return failure<T>(ex.message, ex)
      } else {
         return failure<T>(String(ex))
      }
   }
}