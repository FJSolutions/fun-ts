/**
 * Pipes a value through a series of functions and returns a result.
 * @param data The value to start the pipe with
 * @param func1 A function that takes an A and returns a B
 * @return An `B`
 */
export function pipe<A, B>(
   data: A,
   func1: (value: A) => B,
): B
/**
 * Pipes a value through a series of functions and returns a result.
 * @param data The value to start the pipe with
 * @param func1 A function that takes an A and returns a B
 * @param func2 A function that takes a B and returns a C
 * @return An `C`
 */
export function pipe<A, B, C>(
   data: A,
   func1: (value: A) => B,
   func2: (value: B) => C,
): C
/**
 * Pipes a value through a series of functions and returns a result.
 * @param data The value to start the pipe with
 * @param func1 A function that takes an A and returns a B
 * @param func2 A function that takes a B and returns a C
 * @param func3 A function that takes a C and returns a D
 * @return An `D`
 */
export function pipe<A, B, C, D>(
   data: A,
   func1: (value: A) => B,
   func2: (value: B) => C,
   func3: (value: C) => D,
): D
/**
 * Pipes a value through a series of functions and returns a result.
 * @param data The value to start the pipe with
 * @param func1 A function that takes an A and returns a B
 * @param func2 A function that takes a B and returns a C
 * @param func3 A function that takes a C and returns a D
 * @param func4 A function that takes a D and returns an E
 * @return An `E`
 */
export function pipe<A, B, C, D, E>(
   data: A,
   func1: (value: A) => B,
   func2: (value: B) => C,
   func3: (value: C) => D,
   func4: (value: D) => E,
): E
/**
 * Pipes a value through a series of functions and returns a result.
 * @param data The value to start the pipe with
 * @param func1 A function that takes an A and returns a B
 * @param func2 A function that takes a B and returns a C
 * @param func3 A function that takes a C and returns a D
 * @param func4 A function that takes a D and returns an E
 * @param func5 A function that takes an E and returns an F
 * @return An `F`
 */
export function pipe<A, B, C, D, E, F>(
   data: A,
   func1: (value: A) => B,
   func2: (value: B) => C,
   func3: (value: C) => D,
   func4: (value: D) => E,
   func5: (value: E) => F,
): F
/**
 * Pipes a value through a series of functions and returns a result.
 * @param data The value to start the pipe with
 * @param func1 A function that takes an A and returns a B
 * @param func2 A function that takes a B and returns a C
 * @param func3 A function that takes a C and returns a D
 * @param func4 A function that takes a D and returns an E
 * @param func5 A function that takes an E and returns an F
 * @param func6 A function that takes an F and returns a G
 * @return An `G`
 */
export function pipe<A, B, C, D, E, F, G>(
   data: A,
   func1: (value: A) => B,
   func2: (value: B) => C,
   func3: (value: C) => D,
   func4: (value: D) => E,
   func5: (value: E) => F,
   func6: (value: F) => G,
): G
/**
 * Pipes a value through a series of functions and returns a result.
 * @param data The value to start the pipe with
 * @param func1 A function that takes an A and returns a B
 * @param func2 A function that takes a B and returns a C
 * @param func3 A function that takes a C and returns a D
 * @param func4 A function that takes a D and returns an E
 * @param func5 A function that takes an E and returns an F
 * @param func6 A function that takes an F and returns a G
 * @param func7 A function that takes a G and returns an H
 * @return An `H`
 */
export function pipe<A, B, C, D, E, F, G, H>(
   data: A,
   func1: (value: A) => B,
   func2: (value: B) => C,
   func3: (value: C) => D,
   func4: (value: D) => E,
   func5: (value: E) => F,
   func6: (value: F) => G,
   func7: (value: G) => H,
): H
/**
 * Pipes a value through a series of functions and returns a result.
 * @param data The value to start the pipe with
 * @param func1 A function that takes an A and returns a B
 * @param func2 A function that takes a B and returns a C
 * @param func3 A function that takes a C and returns a D
 * @param func4 A function that takes a D and returns an E
 * @param func5 A function that takes an E and returns an F
 * @param func6 A function that takes an F and returns a G
 * @param func7 A function that takes a G and returns an H
 * @param func8 A function that takes an H and returns an I
 * @return An `I`
 */
export function pipe<A, B, C, D, E, F, G, H, I>(
   data: A,
   func1: (value: A) => B,
   func2: (value: B) => C,
   func3: (value: C) => D,
   func4: (value: D) => E,
   func5: (value: E) => F,
   func6: (value: F) => G,
   func7: (value: G) => H,
   func8: (value: H) => I,
): I
/**
 * Pipes a value through a series of functions and returns a result.
 * @param data The value to start the pipe with
 * @param func1 A function that takes an A and returns a B
 * @param func2 A function that takes a B and returns a C
 * @param func3 A function that takes a C and returns a D
 * @param func4 A function that takes a D and returns an E
 * @param func5 A function that takes an E and returns an F
 * @param func6 A function that takes an F and returns a G
 * @param func7 A function that takes a G and returns an H
 * @param func8 A function that takes an H and returns an I
 * @param func9 A function that takes an I and returns a J
 * @return A `J`
 */
export function pipe<A, B, C, D, E, F, G, H, I, J>(
   data: A,
   func1: (value: A) => B,
   func2: (value: B) => C,
   func3: (value: C) => D,
   func4: (value: D) => E,
   func5: (value: E) => F,
   func6: (value: F) => G,
   func7: (value: G) => H,
   func8: (value: H) => I,
   func9: (value: I) => J,
): J
export function pipe(
   data: any,
   ...funcs: ((value: any) => any)[]
) {
   return funcs.reduce((acc, func) => func(acc), data)
}
