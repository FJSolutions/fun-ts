import { describe, expect, it } from "vitest";
import { none, some } from "../../src/OF/option/option-transforms";

describe("option-transforms", () => {

   describe("some", () => {
      it("should create a Some with correct kind and tag", () => {
         const result = some(42)
         expect(result.kind).toBe("Option")
         expect(result.tag).toBe("Some")
         expect(result.isSome).toBeTruthy()
         expect(result.isNone).toBeFalsy()
      })

      it("should return the value via orElse", () => {
         expect(some(42).orElse(-1)).toBe(42)
      })

      it("should convert to a successful Result", () => {
         const result = some(42).toResult("error")
         expect(result.isSuccess).toBeTruthy()
         expect(result.isFailure).toBeFalsy()
         expect(result.orElse(-1)).toBe(42)
      })

      it("should ignore the error message when the option is Some", () => {
         const result = some(42).toResult("should not appear")
         expect(result.isSuccess).toBeTruthy()
         expect(result.orElse(-1)).toBe(42)
      })

      it("should work with string values", () => {
         const result = some("hello").toResult("error")
         expect(result.isSuccess).toBeTruthy()
         expect(result.orElse("default")).toBe("hello")
      })

      it("should work with object values", () => {
         const obj = { id: 1, name: "alice" }
         const result = some(obj).toResult("error")
         expect(result.isSuccess).toBeTruthy()
         expect(result.orElse({ id: 0, name: "" })).toEqual({ id: 1, name: "alice" })
      })

      it("should work with zero as a value", () => {
         const result = some(0).toResult("error")
         expect(result.isSuccess).toBeTruthy()
         expect(result.orElse(-1)).toBe(0)
      })

      it("should work with false as a value", () => {
         const result = some(false).toResult("error")
         expect(result.isSuccess).toBeTruthy()
         expect(result.orElse(true)).toBe(false)
      })
   })

   describe("none", () => {
      it("should create a None with correct kind and tag", () => {
         const result = none()
         expect(result.kind).toBe("Option")
         expect(result.tag).toBe("None")
         expect(result.isSome).toBeFalsy()
         expect(result.isNone).toBeTruthy()
      })

      it("should return the default value via orElse", () => {
         expect(none<number>().orElse(-1)).toBe(-1)
      })

      it("should convert to a failed Result", () => {
         const result = none<number>().toResult("no value present")
         expect(result.isFailure).toBeTruthy()
         expect(result.isSuccess).toBeFalsy()
      })

      it("should preserve the error message in the failed Result", () => {
         const errorMessage = "value was missing"
         const matched = none<number>()
            .toResult(errorMessage)
            .match(() => "success", msg => msg)
         expect(matched).toBe(errorMessage)
      })

      it("should produce distinct error messages for distinct calls", () => {
         const msg1 = none<number>().toResult("first error").match(() => "", msg => msg)
         const msg2 = none<string>().toResult("second error").match(() => "", msg => msg)
         expect(msg1).toBe("first error")
         expect(msg2).toBe("second error")
      })

      it("should not call orElse on the Result when None", () => {
         const result = none<number>().toResult("empty")
         expect(result.orElse(-99)).toBe(-99)
      })
   })

   describe("MaybeTransformer", () => {
      it("should be constructable as a Some", () => {
         const t = some(42)
         expect(t.isSome).toBeTruthy()
         expect(t.orElse(-1)).toBe(42)
      })

      it("should be constructable as a None", () => {
         const t = none<number>()
         expect(t.isNone).toBeTruthy()
         expect(t.orElse(-1)).toBe(-1)
      })

      it("should convert a Some to a successful Result", () => {
         const result = some(99).toResult("error")
         expect(result.isSuccess).toBeTruthy()
         expect(result.orElse(-1)).toBe(99)
      })

      it("should convert a None to a failed Result with the given message", () => {
         const t = none<number>()
         const matched = t.toResult("transformer none error").match(() => "", msg => msg)
         expect(matched).toBe("transformer none error")
      })
   })

   describe("inherited Option behaviour", () => {
      it("should map a Some value", () => {
         const result = some(21).map(x => x * 2).orElse(-1)
         expect(result).toBe(42)
      })

      it("should return None from map when starting with None", () => {
         const result = none<number>().map(x => x * 2).orElse(-1)
         expect(result).toBe(-1)
      })

      it("should flatMap a Some value", () => {
         const result = some(21).flatMap(x => some(x * 2)).orElse(-1)
         expect(result).toBe(42)
      })

      it("should return None from flatMap when starting with None", () => {
         const result = none<number>().flatMap(x => some(x * 2)).orElse(-1)
         expect(result).toBe(-1)
      })

      it("should match a Some", () => {
         const result = some(42).match(v => `got ${v}`, () => "none")
         expect(result).toBe("got 42")
      })

      it("should match a None", () => {
         const result = none<number>().match(v => `got ${v}`, () => "none")
         expect(result).toBe("none")
      })

      it("should filter in a passing value", () => {
         expect(some(42).filter(x => x > 18).orElse(-1)).toBe(42)
      })

      it("should filter out a failing value", () => {
         expect(some(10).filter(x => x > 18).orElse(-1)).toBe(-1)
      })

      it("should fold a Some value", () => {
         expect(some(42).fold((acc, v) => acc + v, 0).orElse(-1)).toBe(42)
      })

      it("should return None from fold when starting with None", () => {
         expect(none<number>().fold((acc, v) => acc + v, 0).orElse(-1)).toBe(-1)
      })
   })

})
