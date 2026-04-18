import { describe, expect, it } from "vitest";
import { some, none, isSome, isNone, from, orElse, map, flatMap, filter, reduce, match } from "../../src/FP/option";
import type { Option } from "../../src/FP/types";

describe("FP.Option", () => {

   describe("some", () => {
      it("kind is 'Option'", () => {
         expect(some(42).kind).toBe("Option")
      })

      it("type is 'Some'", () => {
         expect(some(42).type).toBe("Some")
      })

      it("holds the wrapped value", () => {
         const opt = some(42) as Option<number> & { value: number }
         expect(opt.value).toBe(42)
      })

      it("works with string values", () => {
         const opt = some("hello") as Option<string> & { value: string }
         expect(opt.value).toBe("hello")
      })

      it("works with falsy values", () => {
         const zero = some(0) as Option<number> & { value: number }
         const falsy = some(false) as Option<boolean> & { value: boolean }
         expect(zero.value).toBe(0)
         expect(falsy.value).toBe(false)
      })

      it("works with object values", () => {
         const obj = {id: 1}
         const opt = some(obj) as Option<typeof obj> & { value: typeof obj }
         expect(opt.value).toBe(obj)
      })
   })

   describe("none", () => {
      it("kind is 'Option'", () => {
         expect(none().kind).toBe("Option")
      })

      it("type is 'None'", () => {
         expect(none().type).toBe("None")
      })

      it("has no value", () => {
         const opt = none() as { value?: unknown }
         expect(opt.value).toBeUndefined()
      })
   })

   describe("isSome", () => {
      it("returns true for a Some option", () => {
         expect(isSome(some(42))).toBe(true)
      })

      it("returns false for a None option", () => {
         expect(isSome(none())).toBe(false)
      })
   })

   describe("isNone", () => {
      it("returns true for a None option", () => {
         expect(isNone(none())).toBe(true)
      })

      it("returns false for a Some option", () => {
         expect(isNone(some(42))).toBe(false)
      })
   })

   describe("from", () => {
      it("returns Some for a defined value", () => {
         expect(isSome(from(42))).toBe(true)
      })

      it("returns None for null", () => {
         expect(isNone(from(null))).toBe(true)
      })

      it("returns None for undefined", () => {
         expect(isNone(from(undefined))).toBe(true)
      })

      it("returns Some for falsy but defined values", () => {
         expect(isSome(from(0))).toBe(true)
         expect(isSome(from(false))).toBe(true)
         expect(isSome(from(""))).toBe(true)
      })
   })

   describe("orElse", () => {
      it("returns the wrapped value for a Some", () => {
         expect(orElse(-1)(some(42))).toBe(42)
      })

      it("returns the default for a None", () => {
         expect(orElse(-1)(none())).toBe(-1)
      })

      it("returns falsy wrapped values rather than the default", () => {
         expect(orElse(-1)(some(0))).toBe(0)
         expect(orElse(true)(some(false))).toBe(false)
      })
   })

   describe("map", () => {
      it("transforms the value inside a Some", () => {
         expect(orElse(-1)(map((x: number) => x * 2)(some(21)))).toBe(42)
      })

      it("returns None unchanged when mapping over None", () => {
         expect(isNone(map((x: number) => x * 2)(none()))).toBe(true)
      })

      it("preserves the Some structure after mapping", () => {
         expect(isSome(map((s: string) => s.length)(some("hello")))).toBe(true)
      })
   })

   describe("flatMap", () => {
      it("returns the inner Some when the outer is Some", () => {
         expect(orElse(-1)(flatMap((x: number) => some(x * 2))(some(21)))).toBe(42)
      })

      it("returns None when the outer is None", () => {
         expect(isNone(flatMap((x: number) => some(x * 2))(none()))).toBe(true)
      })

      it("returns None when the mapping function returns None", () => {
         expect(isNone(flatMap(_ => none())(some(42)))).toBe(true)
      })
   })

   describe("filter", () => {
      it("keeps a Some when the predicate passes", () => {
         expect(orElse(-1)(filter<number>(x => x > 18)(some(42)))).toBe(42)
      })

      it("returns None when the predicate fails", () => {
         expect(isNone(filter((x: number) => x > 18)(some(10)))).toBe(true)
      })

      it("returns None unchanged when filtering a None", () => {
         expect(isNone(filter<number>(x => x > 18)(none()))).toBe(true)
      })
   })

   describe("reduce", () => {
      it("applies the accumulator to the value inside a Some", () => {
         expect(reduce(some(42), (acc, x) => acc + x, 0)).toBe(42)
      })

      it("returns the initial value for a None", () => {
         expect(reduce(none() as Option<number>, (acc, x) => acc + x, 0)).toBe(0)
      })

      it("accumulates into a different type", () => {
         expect(reduce(some(42), (acc, x) => `${acc}${x}`, "value: ")).toBe("value: 42")
      })
   })

   describe("match", () => {
      it("calls onSome with the value for a Some", () => {
         expect(match(some(42), x => `some(${x})`, () => "none")).toBe("some(42)")
      })

      it("calls onNone for a None", () => {
         expect(match(none() as Option<number>, x => `some(${x})`, () => "none")).toBe("none")
      })

      it("can return different types from each branch", () => {
         expect(match(some(42), x => x + 1, () => 0)).toBe(43)
         expect(match(none() as Option<number>, x => x + 1, () => 0)).toBe(0)
      })
   })

})