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
		return func9(func8(func7(func6(func5(func4(func3(func2(func1(data)))))))));
	if (func2 && func3 && func4 && func5 && func6 && func7 && func8)
		return func8(func7(func6(func5(func4(func3(func2(func1(data))))))));
	if (func2 && func3 && func4 && func5 && func6 && func7)
		return func7(func6(func5(func4(func3(func2(func1(data)))))));
	if (func2 && func3 && func4 && func5 && func6)
		return func6(func5(func4(func3(func2(func1(data))))));
	if (func2 && func3 && func4 && func5)
		return func5(func4(func3(func2(func1(data)))));
	if (func2 && func3 && func4) return func4(func3(func2(func1(data))));
	if (func2 && func3) return func3(func2(func1(data)));
	if (func2) return func2(func1(data));
	return func1(data);
};
