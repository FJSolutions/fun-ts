import { expect, test } from "vitest";
import { id, pipe } from "../src/";
import * as Seq from "../src/sequence";

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

test("pipe with sequence", () => {
	expect(pipe([1, 2, 3], Seq.toList)).toEqual([1, 2, 3]);
	expect(pipe([1, 2, 3], Seq.toList, (list) => list.length)).toBe(3);
	expect(pipe([1, 2, 3], Seq.toList, (list) => list.map((x) => x * 2))).toEqual(
		[2, 4, 6],
	);
	expect(
		pipe([1, 2, 3], Seq.toList, (list) => list.filter((x) => x % 2 === 0)),
	).toEqual([2]);
	expect(pipe([1, 2, 3], (list) => list.filter((x) => x % 2 === 0))).toEqual([
		2,
	]);
	expect(
		pipe(
			[1, 2, 3],
			Seq.fold((acc, x) => acc + x, 0),
		),
	).toEqual(6);
	expect(
		pipe(
			["This", "is", "a", "string"],
			Seq.fold((acc, x) => `${acc}${x} `, ""),
		),
	).toEqual("This is a string ");
});
