import { describe, expect, test } from "vitest";
import { id } from "../src";
import * as Seq from "../src/sequence";
import * as P from "../src/pipe";
import * as N from "../src/numbers";
import * as S from "../src/strings";

describe("Do", () => {
   test("returns a value from a single bind", () => {
      const result = P.accumulator()
         .bind("a", () => 42)
         .return(({a}) => a)

      expect(result).toBe(42)
   })

   test("later binds can reference earlier ones", () => {
      const result = P.accumulator()
         .bind("a", () => 10)
         .bind("b", ({a}) => a + 5)
         .return(({a, b}) => a + b)

      expect(result).toBe(25)
   })

   test("handles heterogeneous types", () => {
      const result = P.accumulator()
         .bind("n", () => 42)
         .bind("s", () => "hello")
         .return(({n, s}) => `${s} ${n}`)

      expect(result).toBe("hello 42")
   })

   test("P.Do with an initial context", () => {
      const result = P.accumulator({initials: "FBJ"})
         .return(ctx => ctx.initials)
      expect(result).toBe("FBJ")
   })

   test("P.Do with values, Options, and results", () => {
      const result = P.accumulator()
         .bind("noOpt", ctx => N.toFloatResult("FBJ"))
         .return(ctx => ctx.noOpt.orElse(-1))
      expect(result).toBe(-1)
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

   test("P.Pipe with values, Options, and results", () => {
      const result = P.pipe(
         "007",
         N.toIntOption,
         (o) => o.toResult("Not a number"),
         (r) => r.orElse(-1)
      )
      expect(result).toEqual(7)
   })
})