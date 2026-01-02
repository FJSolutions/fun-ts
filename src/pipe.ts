/**
 * Pipes a value through a series of functions.
 */
export const pipe = <A, B, C, D, E, F, G, H, I, J>(
	data: A,
	func1: (a: A) => B,
	func2?: (value: B) => C,
	func3?: (value: C) => D,
	func4?: (value: D) => E,
	func5?: (value: E) => F,
	func6?: (value: F) => G,
	func7?: (value: G) => H,
	func8?: (value: H) => I,
	func9?: (value: I) => J,
): A | B | C | D | E | F | G | H | I | J => {
	if (func2 && func3 && func4 && func5 && func6 && func7 && func8 && func9)
		return pipe9(
			data,
			func1,
			func2,
			func3,
			func4,
			func5,
			func6,
			func7,
			func8,
			func9,
		);
	if (func2 && func3 && func4 && func5 && func6 && func7 && func8)
		return pipe8(data, func1, func2, func3, func4, func5, func6, func7, func8);
	if (func2 && func3 && func4 && func5 && func6 && func7)
		return pipe7(data, func1, func2, func3, func4, func5, func6, func7);
	if (func2 && func3 && func4 && func5 && func6)
		return pipe6(data, func1, func2, func3, func4, func5, func6);
	if (func2 && func3 && func4 && func5)
		return pipe5(data, func1, func2, func3, func4, func5);
	if (func2 && func3 && func4) return pipe4(data, func1, func2, func3, func4);
	if (func2 && func3) return pipe3(data, func1, func2, func3);
	if (func2) return pipe2(data, func1, func2);
	return pipe1(data, func1);
};

export const pipe1 = <T, T1>(val: T, func: (processor: T) => T1): T1 => {
	return func(val);
};

export const pipe2 = <A, B, C>(
	val: A,
	func1: (processor: A) => B,
	func2: (processor: B) => C,
): C => {
	return func2(func1(val));
};

export const pipe3 = <A, B, C, D>(
	val: A,
	func1: (processor: A) => B,
	func2: (processor: B) => C,
	func3: (processor: C) => D,
): D => {
	return func3(func2(func1(val)));
};

export const pipe4 = <A, B, C, D, E>(
	val: A,
	func1: (processor: A) => B,
	func2: (processor: B) => C,
	func3: (processor: C) => D,
	func4: (processor: D) => E,
): E => {
	return func4(func3(func2(func1(val))));
};

export const pipe5 = <A, B, C, D, E, F>(
	val: A,
	func1: (processor: A) => B,
	func2: (processor: B) => C,
	func3: (processor: C) => D,
	func4: (processor: D) => E,
	func5: (processor: E) => F,
): F => {
	return func5(func4(func3(func2(func1(val)))));
};

export const pipe6 = <A, B, C, D, E, F, G>(
	val: A,
	func1: (processor: A) => B,
	func2: (processor: B) => C,
	func3: (processor: C) => D,
	func4: (processor: D) => E,
	func5: (processor: E) => F,
	func6: (processor: F) => G,
): G => {
	return func6(func5(func4(func3(func2(func1(val))))));
};

export const pipe7 = <A, B, C, D, E, F, G, H>(
	val: A,
	func1: (processor: A) => B,
	func2: (processor: B) => C,
	func3: (processor: C) => D,
	func4: (processor: D) => E,
	func5: (processor: E) => F,
	func6: (processor: F) => G,
	func7: (processor: G) => H,
): H => {
	return func7(func6(func5(func4(func3(func2(func1(val)))))));
};

export const pipe8 = <A, B, C, D, E, F, G, H, I>(
	val: A,
	func1: (processor: A) => B,
	func2: (processor: B) => C,
	func3: (processor: C) => D,
	func4: (processor: D) => E,
	func5: (processor: E) => F,
	func6: (processor: F) => G,
	func7: (processor: G) => H,
	func8: (processor: H) => I,
): I => {
	return func8(func7(func6(func5(func4(func3(func2(func1(val))))))));
};

export const pipe9 = <A, B, C, D, E, F, G, H, I, J>(
	val: A,
	func1: (processor: A) => B,
	func2: (processor: B) => C,
	func3: (processor: C) => D,
	func4: (processor: D) => E,
	func5: (processor: E) => F,
	func6: (processor: F) => G,
	func7: (processor: G) => H,
	func8: (processor: H) => I,
	func9: (processor: I) => J,
): J => {
	return func9(func8(func7(func6(func5(func4(func3(func2(func1(val)))))))));
};
