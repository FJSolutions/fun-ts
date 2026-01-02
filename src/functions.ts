/**
 * The `identity` function which returns its argument unchanged.
 * (Sometimes called `empty` or `zero`)
 * @param x The argument to return.
 * @returns The argument unchanged.
 */
export const id = <T>(x: T): T => x;

/**
 * Folds the values of an iterable into a single value using a folder function.
 * @param folder A function that folds the next value into the accumulator.
 * @param accumulator The initial value of the accumulator
 * @returns The final value of the accumulator
 */
export const fold = <S, V>(folder: (acc: S, next: V) => S, accumulator: S) => {
	return (input: Iterable<V>): S => {
		if (typeof input[Symbol.iterator] !== "function") {
			throw new Error("The input to `fold` is not iterable");
		}

		for (const val of input) {
			folder(accumulator, val as V);
		}

		return accumulator;
	};
};
