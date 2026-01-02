import { expect, test } from "vitest";
import { id, pipe } from "../src/";

test("pipe with same type", () => {
	expect(pipe(1, id)).toBe(1);
	expect(pipe(1, (x) => x + 1)).toBe(2);
	expect(
		pipe(
			1,
			(x) => x + 1,
			(x) => x * 2,
		),
	).toBe(4);
	expect(
		pipe(
			1,
			(x) => x + 1,
			(x) => x * 2,
			(x) => x ** 2,
		),
	).toBe(16);
});

test("pipe with different types", () => {
	expect(pipe("hello", (s) => s.toUpperCase())).toBe("HELLO");
	expect(
		pipe(
			1,
			(x) => x + 1,
			(x) => x.toString(),
			(x) => parseFloat(x),
			(x) => x.toFixed(1),
			(x) => x.toString(),
		),
	).toBe("2.0");
	expect(
		pipe(
			1,
			(x) => x + 1,
			(x) => x * 2,
			(x) => x.toString(),
			(s) => s.length,
		),
	).toBe(1);
});
