import { none, type Option, some } from "./option";

interface ResultBase<T> {
   /**
    * If the result is a Failure then the default value is returned
    * @param The default value to return if the Result is a Failure
    */
   orElse: (defaultValue: T) => T
   /**
    * Converts the Result to an Option
    */
   toOption: () => Option<T>;
}

interface Success<T> extends ResultBase<T> {
   key: "Success",
   value: T
}

interface Failure<T> extends ResultBase<T> {
   key: "Failure",
   message: string,
   error?: Error
}

/**
 * The public interface of the Result type
 */
export type Result<T> = Success<T> | Failure<T>;

/**
 * Creates an OK `Result<T>`
 * @param value The OK value
 */
export const success = <T>(value: T): Result<T> => ({
   key: "Success",
   value,
   orElse: (_defaultValue: T) => value,
   toOption: () => some(value),
})

/**
 * Creates a failure `Result<T>`
 * @param message The message to use to describe the failure
 * @param error The Error (if any) that caused the failure
 */
export const failure = <T extends unknown>(message: string, error?: Error): Result<T> => ({
   key: "Failure",
   message,
   error,
   orElse: (defaultValue) => defaultValue,
   toOption: () => none()
})

/**
 * Wraps a function that may throw into a Result.
 * @param func A function that returns a value or throws
 */
export const of = <T>(func: () => T): Result<T> => {
   try {
      return success(func())
   } catch (ex) {
      const err = ex instanceof Error ? ex : new Error(String(ex))
      return failure(err.message, err)
   }
}

/**
 * Checks if a Result is Ok
 */
export const isSuccess = <T>(result: Result<T>): result is Success<T> => result.key === "Success"

/**
 * Checks if a Result is Failure
 */
export const isFailure = <T>(result: Result<T>): result is Failure<T> => result.key === "Failure"

/**
 * Transforms the value inside an Ok result. Passes Failure through unchanged.
 * @param func A function to apply to the Ok value
 */
export const map = <T, U>(func: (value: T) => U) => (result: Result<T>): Result<U> => {
   if (isSuccess(result)) {
      return success(func(result.value))
   }
   return failure<U>(result.message, result.error)
}

/**
 * Chains a Result-returning function onto an Ok result, flattening the result.
 * Passes Failure through unchanged.
 * @param func A function that takes a plain value and returns a Result
 */
export const flatMap = <T, U>(func: (value: T) => Result<U>) => (result: Result<T>): Result<U> => {
   if (isSuccess(result)) {
      return func(result.value)
   }
   return failure<U>(result.message, result.error)
}

/**
 * Turns an Ok into a Failure if the value does not satisfy the predicate.
 * @param predicate A predicate to test the Ok value against
 * @param message The failure message if the predicate is not satisfied
 */
export const filter = <T>(predicate: (value: T) => boolean, message: string) => (result: Result<T>): Result<T> => {
   if (isSuccess(result) && !predicate(result.value)) {
      return failure(message)
   }
   return result
}

/**
 * Folds a Result into a single value by handling both Ok and Failure cases.
 * @param onFailure A function to handle the Failure case
 * @param onOk A function to handle the Ok value
 */
export const fold = <T, U>(onFailure: (message: string, error?: Error) => U, onOk: (value: T) => U) => (result: Result<T>): U => {
   if (isSuccess(result)) {
      return onOk(result.value)
   }
   return onFailure(result.message, result.error)
}

/**
 * Returns the Ok value or a default if the Result is a Failure.
 * @param defaultValue The value to return if the Result is a Failure
 */
export const orElse = <T>(defaultValue: T) => (result: Result<T>): T => {
   if (isSuccess(result)) {
      return result.value
   }
   return defaultValue
}

/**
 * Lifts a function that may throw to operate on a Result.
 * @param func A function that takes a plain value and may throw
 */
export const lift = <A, B>(func: (value: A) => B) => (result: Result<A>): Result<B> => {
   if (isSuccess(result)) {
      return of(() => func(result.value))
   }
   return failure<B>(result.message, result.error)
}

/**
 * Matches the supplied result as an Ok or Failure and executes the corresponding function
 * @param ok The function fire if the Result is an Ok
 * @param failure The function to fire if the Result is a Failure
 * @return A `U`
 */
export const match = <T, U>(ok: (value: T) => U, failure: (message: string, error?: Error) => U) => (result: Result<T>) => {
   if (isSuccess(result)) {
      return ok(result.value)
   } else {
      return failure(result.message, result.error)
   }
}

/**
 * Pipes a Result through a series of functions and returns a result.
 * @param result The Result to start the pipe with
 * @param func1 A function that takes a Result<A> and returns a Result<B>
 * @return A Result<B>
 */
export function pipe<A, B>(
   result: Result<A>,
   func1: (value: Result<A>) => Result<B>,
): Result<B>
/**
 * Pipes a Result through a series of functions and returns a result.
 * @param result The Result to start the pipe with
 * @param func1 A function that takes a Result<A> and returns a Result<B>
 * @param func2 A function that takes a Result<B> and returns a Result<C>
 * @return A Result<C>
 */
export function pipe<A, B, C>(
   result: Result<A>,
   func1: (value: Result<A>) => Result<B>,
   func2: (value: Result<B>) => Result<C>,
): Result<C>
/**
 * Pipes a Result through a series of functions and returns a result.
 * @param result The Result to start the pipe with
 * @param func1 A function that takes a Result<A> and returns a Result<B>
 * @param func2 A function that takes a Result<B> and returns a Result<C>
 * @param func3 A function that takes a Result<C> and returns a Result<D>
 * @return A Result<D>
 */
export function pipe<A, B, C, D>(
   result: Result<A>,
   func1: (value: Result<A>) => Result<B>,
   func2: (value: Result<B>) => Result<C>,
   func3: (value: Result<C>) => Result<D>,
): Result<D>
/**
 * Pipes a Result through a series of functions and returns a result.
 * @param result The Result to start the pipe with
 * @param func1 A function that takes a Result<A> and returns a Result<B>
 * @param func2 A function that takes a Result<B> and returns a Result<C>
 * @param func3 A function that takes a Result<C> and returns a Result<D>
 * @param func4 A function that takes a Result<D> and returns a Result<E>
 * @return A Result<E>
 */
export function pipe<A, B, C, D, E>(
   result: Result<A>,
   func1: (value: Result<A>) => Result<B>,
   func2: (value: Result<B>) => Result<C>,
   func3: (value: Result<C>) => Result<D>,
   func4: (value: Result<D>) => Result<E>,
): Result<E>
/**
 * Pipes a Result through a series of functions and returns a result.
 * @param result The Result to start the pipe with
 * @param func1 A function that takes a Result<A> and returns a Result<B>
 * @param func2 A function that takes a Result<B> and returns a Result<C>
 * @param func3 A function that takes a Result<C> and returns a Result<D>
 * @param func4 A function that takes a Result<D> and returns a Result<E>
 * @param func5 A function that takes a Result<E> and returns a Result<F>
 * @return A Result<F>
 */
export function pipe<A, B, C, D, E, F>(
   result: Result<A>,
   func1: (value: Result<A>) => Result<B>,
   func2: (value: Result<B>) => Result<C>,
   func3: (value: Result<C>) => Result<D>,
   func4: (value: Result<D>) => Result<E>,
   func5: (value: Result<E>) => Result<F>,
): Result<F>
/**
 * Pipes a Result through a series of functions and returns a result.
 * @param result The Result to start the pipe with
 * @param func1 A function that takes a Result<A> and returns a Result<B>
 * @param func2 A function that takes a Result<B> and returns a Result<C>
 * @param func3 A function that takes a Result<C> and returns a Result<D>
 * @param func4 A function that takes a Result<D> and returns a Result<E>
 * @param func5 A function that takes a Result<E> and returns a Result<F>
 * @param func6 A function that takes a Result<F> and returns a Result<G>
 * @return A Result<G>
 */
export function pipe<A, B, C, D, E, F, G>(
   result: Result<A>,
   func1: (value: Result<A>) => Result<B>,
   func2: (value: Result<B>) => Result<C>,
   func3: (value: Result<C>) => Result<D>,
   func4: (value: Result<D>) => Result<E>,
   func5: (value: Result<E>) => Result<F>,
   func6: (value: Result<F>) => Result<G>,
): Result<G>
/**
 * Pipes a Result through a series of functions and returns a result.
 * @param result The Result to start the pipe with
 * @param func1 A function that takes a Result<A> and returns a Result<B>
 * @param func2 A function that takes a Result<B> and returns a Result<C>
 * @param func3 A function that takes a Result<C> and returns a Result<D>
 * @param func4 A function that takes a Result<D> and returns a Result<E>
 * @param func5 A function that takes a Result<E> and returns a Result<F>
 * @param func6 A function that takes a Result<F> and returns a Result<G>
 * @param func7 A function that takes a Result<G> and returns a Result<H>
 * @return A Result<H>
 */
export function pipe<A, B, C, D, E, F, G, H>(
   result: Result<A>,
   func1: (value: Result<A>) => Result<B>,
   func2: (value: Result<B>) => Result<C>,
   func3: (value: Result<C>) => Result<D>,
   func4: (value: Result<D>) => Result<E>,
   func5: (value: Result<E>) => Result<F>,
   func6: (value: Result<F>) => Result<G>,
   func7: (value: Result<G>) => Result<H>,
): Result<H>
/**
 * Pipes a Result through a series of functions and returns a result.
 * @param result The Result to start the pipe with
 * @param func1 A function that takes a Result<A> and returns a Result<B>
 * @param func2 A function that takes a Result<B> and returns a Result<C>
 * @param func3 A function that takes a Result<C> and returns a Result<D>
 * @param func4 A function that takes a Result<D> and returns a Result<E>
 * @param func5 A function that takes a Result<E> and returns a Result<F>
 * @param func6 A function that takes a Result<F> and returns a Result<G>
 * @param func7 A function that takes a Result<G> and returns a Result<H>
 * @param func8 A function that takes a Result<H> and returns a Result<I>
 * @return A Result<I>
 */
export function pipe<A, B, C, D, E, F, G, H, I>(
   result: Result<A>,
   func1: (value: Result<A>) => Result<B>,
   func2: (value: Result<B>) => Result<C>,
   func3: (value: Result<C>) => Result<D>,
   func4: (value: Result<D>) => Result<E>,
   func5: (value: Result<E>) => Result<F>,
   func6: (value: Result<F>) => Result<G>,
   func7: (value: Result<G>) => Result<H>,
   func8: (value: Result<H>) => Result<I>,
): Result<I>
/**
 * Pipes a Result through a series of functions and returns a result.
 * @param result The Result to start the pipe with
 * @param func1 A function that takes a Result<A> and returns a Result<B>
 * @param func2 A function that takes a Result<B> and returns a Result<C>
 * @param func3 A function that takes a Result<C> and returns a Result<D>
 * @param func4 A function that takes a Result<D> and returns a Result<E>
 * @param func5 A function that takes a Result<E> and returns a Result<F>
 * @param func6 A function that takes a Result<F> and returns a Result<G>
 * @param func7 A function that takes a Result<G> and returns a Result<H>
 * @param func8 A function that takes a Result<H> and returns a Result<I>
 * @param func9 A function that takes a Result<I> and returns a Result<J>
 * @return A Result<J>
 */
export function pipe<A, B, C, D, E, F, G, H, I, J>(
   result: Result<A>,
   func1: (value: Result<A>) => Result<B>,
   func2: (value: Result<B>) => Result<C>,
   func3: (value: Result<C>) => Result<D>,
   func4: (value: Result<D>) => Result<E>,
   func5: (value: Result<E>) => Result<F>,
   func6: (value: Result<F>) => Result<G>,
   func7: (value: Result<G>) => Result<H>,
   func8: (value: Result<H>) => Result<I>,
   func9: (value: Result<I>) => Result<J>,
): Result<J>
export function pipe(
   result: Result<any>,
   ...funcs: ((value: Result<any>) => Result<any>)[]
) {
   return funcs.reduce((acc, func) => func(acc), result)
}