import { isNullOrUndefined } from "./utils";
import { failure, success, type Result } from "./result";

/**
 * The type definition of an Option
 */
// export type Option<T> = { key: "Some", value: T } | { key: "None" }
export interface Option<T> {
   key: "Some" | "None",
   value: T,
   orElse: (defaultValue: T) => T,
   match: <U>(none: () => U, some: (value: T) => U) => U,
   toResult: (message: string) => Result<T>
}

/**
 * Creates an Option with some value
 * @param value The value in the option
 */
export const some = <T>(value: T): Option<T> => ({
   key: "Some",
   value,
   orElse: (_defaultValue: T) => value,
   match: <U>(_none: () => U, some: (value: T) => U) => some(value),
   toResult: (_message: string): Result<T> => success<T>(value)
})

/**
 * Creates an Option with no value
 */
export const none = <T>(): Option<T> => (
   {
      key: "None",
      value: undefined as T,
      orElse: (defaultValue: T) => defaultValue,
      match: <U>(none: () => U, _some: (value: T) => U) => none(),
      toResult: (message: string): Result<T> => failure(message),
   })

/**
 * Creates an Option of a value
 * @param value
 */
export const of = <T>(value: T | undefined | null): Option<T> => isNullOrUndefined(value) ? none() : some(value)

/**
 * Checks if an Option is Some
 * @param option The option to check
 */
export const isSome = <T>(option: Option<T>): boolean => option.key === "Some"

/**
 * Checks if an Option is None
 * @param option The option to check
 */
export const isNone = <T>(option: Option<T>): boolean => option.key === "None"

/**
 * Unwraps an Option safely returning either the value, if there is some, or the supplied default value.
 * @param defaultValue
 */
export const orElse = <T>(defaultValue: T) => (option: Option<T>): T => isSome(option) ? option.value : defaultValue

/**
 * Matches an Option and runs one of two functions depending on where the Option is some or none
 * @param none The function to run if the Option has some value
 * @param some The function to run if the Option has no value
 */
export const match = <T, U>(none: () => U, some: (value: T) => U) => (option: Option<T>): U => isSome(option) ? some(option.value) : none()

/**
 * Lifts a normal function which operates on values to an Option
 * @param func
 */
export const lift = <A, B>(func: (value: A) => B | null | undefined) => (option: Option<A>): Option<B> => {
   if (isSome(option)) {
      return of(func(option.value))
   }
   return none()
}

/**
 * Pipes an Option value safely through a series of functions.
 * @param option An option to start the pipe with
 * @param func1 A function that takes an A and returns a B, `null`, or `undefined`
 * @return An `Option<B>`
 */
export function pipe<A, B>(
   option: Option<A>,
   func1: (value: Option<A>) => Option<B>,
): Option<B>
/**
 * Pipes an Option value safely through a series of functions.
 * @param option An option to start the pipe with
 * @param func1 A function that takes an A and returns a B, `null`, or `undefined`
 * @param func2 A function that takes a B and returns a C, `null`, or `undefined`
 * @return An `Option<C>`
 */
export function pipe<A, B, C>(
   option: Option<A>,
   func1: (value: Option<A>) => Option<B>,
   func2: (value: Option<B>) => Option<C>
): Option<C>;
/**
 * Pipes an Option value safely through a series of functions.
 * @param option An option to start the pipe with
 * @param func1 A function that takes an A and returns a B, `null`, or `undefined`
 * @param func2 A function that takes a B and returns a C, `null`, or `undefined`
 * @param func3 A function that takes a C and returns a D, `null`, or `undefined`
 * @return An `Option<D>`
 */
export function pipe<A, B, C, D>(
   option: Option<A>,
   func1: (value: Option<A>) => Option<B>,
   func2: (value: Option<B>) => Option<C>,
   func3: (value: Option<C>) => Option<D>
): Option<C>;
/**
 * Pipes an Option value safely through a series of functions.
 * @param option An option to start the pipe with
 * @param func1 A function that takes an A and returns a B, `null`, or `undefined`
 * @param func2 A function that takes a B and returns a C, `null`, or `undefined`
 * @param func3 A function that takes a C and returns a D, `null`, or `undefined`
 * @param func4 A function that takes a D and returns an E, `null`, or `undefined`
 * @return An `Option<E>`
 */
export function pipe<A, B, C, D, E>(
   option: Option<A>,
   func1: (value: Option<A>) => Option<B>,
   func2: (value: Option<B>) => Option<C>,
   func3: (value: Option<C>) => Option<D>,
   func4: (value: Option<D>) => Option<E>
): Option<E>;
/**
 * Pipes an Option value safely through a series of functions.
 * @param option An option to start the pipe with
 * @param func1 A function that takes an A and returns a B, `null`, or `undefined`
 * @param func2 A function that takes a B and returns a C, `null`, or `undefined`
 * @param func3 A function that takes a C and returns a D, `null`, or `undefined`
 * @param func4 A function that takes a D and returns an E, `null`, or `undefined`
 * @param func5 A function that takes an E and returns an F, `null`, or `undefined`
 * @return An `Option<F>`
 */
export function pipe<A, B, C, D, E, F>(
   option: Option<A>,
   func1: (value: Option<A>) => Option<B>,
   func2: (value: Option<B>) => Option<C>,
   func3: (value: Option<C>) => Option<D>,
   func4: (value: Option<D>) => Option<E>,
   func5: (value: Option<E>) => Option<F>
): Option<F>;
/**
 * Pipes an Option value safely through a series of functions.
 * @param option An option to start the pipe with
 * @param func1 A function that takes an A and returns a B, `null`, or `undefined`
 * @param func2 A function that takes a B and returns a C, `null`, or `undefined`
 * @param func3 A function that takes a C and returns a D, `null`, or `undefined`
 * @param func4 A function that takes a D and returns an E, `null`, or `undefined`
 * @param func5 A function that takes an E and returns an F, `null`, or `undefined`
 * @param func6 A function that takes an F and returns a G, `null`, or `undefined`
 * @return An `Option<H>`
 */
export function pipe<A, B, C, D, E, F, G>(
   option: Option<A>,
   func1: (value: Option<A>) => Option<B>,
   func2: (value: Option<B>) => Option<C>,
   func3: (value: Option<C>) => Option<D>,
   func4: (value: Option<D>) => Option<E>,
   func5: (value: Option<E>) => Option<F>,
   func6: (value: Option<F>) => Option<G>
): Option<G>;
/**
 * Pipes an Option value safely through a series of functions.
 * @param option An option to start the pipe with
 * @param func1 A function that takes an A and returns a B, `null`, or `undefined`
 * @param func2 A function that takes a B and returns a C, `null`, or `undefined`
 * @param func3 A function that takes a C and returns a D, `null`, or `undefined`
 * @param func4 A function that takes a D and returns an E, `null`, or `undefined`
 * @param func5 A function that takes an E and returns an F, `null`, or `undefined`
 * @param func6 A function that takes an F and returns a G, `null`, or `undefined`
 * @param func7 A function that takes a G and returns an H, `null`, or `undefined`
 * @return An `Option<H>`
 */
export function pipe<A, B, C, D, E, F, G, H>(
   option: Option<A>,
   func1: (value: Option<A>) => Option<B>,
   func2: (value: Option<B>) => Option<C>,
   func3: (value: Option<C>) => Option<D>,
   func4: (value: Option<D>) => Option<E>,
   func5: (value: Option<E>) => Option<F>,
   func6: (value: Option<F>) => Option<G>,
   func7: (value: Option<G>) => Option<H>
): Option<H>;
/**
 * Pipes an Option value safely through a series of functions.
 * @param option An option to start the pipe with
 * @param func1 A function that takes an A and returns a B, `null`, or `undefined`
 * @param func2 A function that takes a B and returns a C, `null`, or `undefined`
 * @param func3 A function that takes a C and returns a D, `null`, or `undefined`
 * @param func4 A function that takes a D and returns an E, `null`, or `undefined`
 * @param func5 A function that takes an E and returns an F, `null`, or `undefined`
 * @param func6 A function that takes an F and returns a G, `null`, or `undefined`
 * @param func7 A function that takes a G and returns an H, `null`, or `undefined`
 * @param func8 A function that takes an H and returns an I, `null`, or `undefined`
 * @return An `Option<I>`
 */
export function pipe<A, B, C, D, E, F, G, H, I>(
   option: Option<A>,
   func1: (value: Option<A>) => Option<B>,
   func2: (value: Option<B>) => Option<C>,
   func3: (value: Option<C>) => Option<D>,
   func4: (value: Option<D>) => Option<E>,
   func5: (value: Option<E>) => Option<F>,
   func6: (value: Option<F>) => Option<G>,
   func7: (value: Option<G>) => Option<H>,
   func8: (value: Option<H>) => Option<I>
): Option<I>;
/**
 * Pipes an Option value safely through a series of functions.
 * @param option An option to start the pipe with
 * @param func1 A function that takes an A and returns a B, `null`, or `undefined`
 * @param func2 A function that takes a B and returns a C, `null`, or `undefined`
 * @param func3 A function that takes a C and returns a D, `null`, or `undefined`
 * @param func4 A function that takes a D and returns an E, `null`, or `undefined`
 * @param func5 A function that takes an E and returns an F, `null`, or `undefined`
 * @param func6 A function that takes an F and returns a G, `null`, or `undefined`
 * @param func7 A function that takes a G and returns an H, `null`, or `undefined`
 * @param func8 A function that takes an H and returns an I, `null`, or `undefined`
 * @param func9 A function that takes an I and returns a J, `null`, or `undefined`
 * @return And `Option<J>`
 */
export function pipe<A, B, C, D, E, F, G, H, I, J>(
   option: Option<A>,
   func1: (value: Option<A>) => Option<B>,
   func2: (value: Option<B>) => Option<C>,
   func3: (value: Option<C>) => Option<D>,
   func4: (value: Option<D>) => Option<E>,
   func5: (value: Option<E>) => Option<F>,
   func6: (value: Option<F>) => Option<G>,
   func7: (value: Option<G>) => Option<H>,
   func8: (value: Option<H>) => Option<I>,
   func9: (value: Option<I>) => Option<J>,
): Option<J>
export function pipe(
   option: Option<any>,
   ...funcs: ((value: Option<any>) => Option<any>)[]
) {
   return funcs.reduce((acc, func) => func(acc), option)
}