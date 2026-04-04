import { describe, expect, test } from "vitest";
import { id, P } from "../src/";
import * as Seq from "../src/sequence";
import { pipe } from "../src/pipe";

describe("Do", () => {
   test("returns a value from a single bind", () => {
      const result = P.Do()
         .bind("a", () => 42)
         .return(({ a }) => a)

      expect(result).toBe(42)
   })

   test("later binds can reference earlier ones", () => {
      const result = P.Do()
         .bind("a", () => 10)
         .bind("b", ({ a }) => a + 5)
         .return(({ a, b }) => a + b)

      expect(result).toBe(25)
   })

   test("handles heterogeneous types", () => {
      const result = P.Do()
         .bind("n", () => 42)
         .bind("s", () => "hello")
         .return(({ n, s }) => `${s} ${n}`)

      expect(result).toBe("hello 42")
   })
})

describe("P.pipe", () => {
   test("P.pipe with same type", () => {
      expect(P.pipe(1, id)).toBe(1);
      expect(P.pipe(1, (x) => x + 1)).toBe(2);
      expect(
         P.pipe(
            1,
            (x) => x + 1,
            (x) => x * 2,
         ),
      ).toBe(4);
      expect(
         P.pipe(
            1,
            (x) => x + 1,
            (x) => x * 2,
            (x) => x ** 2,
         ),
      ).toBe(16);
   });

   test("P.pipe with different types", () => {
      expect(P.pipe("hello", (s) => s.toUpperCase())).toBe("HELLO");
      expect(
         P.pipe(
            1,
            (x) => x + 1,
            (x) => x.toString(),
            (x) => parseFloat(x),
            (x) => x.toFixed(1),
            (x) => x.toString(),
         ),
      ).toBe("2.0");
      expect(
         P.pipe(
            1,
            (x) => x + 1,
            (x) => x * 2,
            (x) => x.toString(),
            (s) => s.length,
         ),
      ).toBe(1);
   });

   test("P.pipe with sequence", () => {
      expect(P.pipe([1, 2, 3], Seq.toList)).toEqual([1, 2, 3]);
      expect(P.pipe([1, 2, 3], Seq.toList, (list) => list.length)).toBe(3);
      expect(P.pipe([1, 2, 3], Seq.toList, (list) => list.map((x) => x * 2))).toEqual(
         [2, 4, 6],
      );
      expect(
         P.pipe([1, 2, 3], Seq.toList, (list) => list.filter((x) => x % 2 === 0)),
      ).toEqual([2]);
      expect(P.pipe([1, 2, 3], (list) => list.filter((x) => x % 2 === 0))).toEqual([
         2,
      ]);
      expect(
         P.pipe(
            [1, 2, 3],
            Seq.fold((acc, x) => acc + x, 0),
         ),
      ).toEqual(6);
      expect(
         P.pipe(
            ["This", "is", "a", "string"],
            Seq.fold((acc, x) => `${acc}${x} `, ""),
         ),
      ).toEqual("This is a string ");
   });
})