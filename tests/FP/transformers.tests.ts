import { describe, expect, it } from "vitest";
import { toResult, toOption, sequence } from "../../src/FP/transformers";
import { some, none, isSome, isNone, orElse as optionOrElse } from "../../src/FP/option";
import { success, failure, isSuccess, isFailure, orElse, match } from "../../src/FP/result";
import { from, toList } from "../../src/FP/sequence";

describe("FP.Transformers", () => {

   describe("toResult", () => {
      it("converts a Some to a Success", () => {
         expect(isSuccess(toResult(some(42), new Error("unused")))).toBe(true)
      })

      it("preserves the value from a Some", () => {
         expect(orElse(-1)(toResult(some(42), new Error("unused")))).toBe(42)
      })

      it("converts a None to a Failure", () => {
         expect(isFailure(toResult(none(), new Error("not found")))).toBe(true)
      })

      it("uses the error's message when converting a None", () => {
         const err = new Error("not found")
         expect(match(() => "", msg => msg)(toResult(none(), err))).toBe("not found")
      })

      it("attaches the error object to the Failure", () => {
         const err = new Error("not found")
         const result = toResult(none<number>(), err)
         if (!isFailure(result)) throw new Error("expected Failure")
         expect(result.error).toBe(err)
      })

      it("falls back to 'Error' as message when the error has no message property", () => {
         expect(match(() => "", msg => msg)(toResult(none(), "raw string"))).toBe("raw string")
      })

      it("works with falsy Some values", () => {
         expect(isSuccess(toResult(some(0), new Error("unused")))).toBe(true)
         expect(orElse(-1)(toResult(some(0), new Error("unused")))).toBe(0)
      })

      it("works with string Some values", () => {
         expect(orElse("")(toResult(some("hello"), new Error("unused")))).toBe("hello")
      })
   })

   describe("toOption", () => {
      it("converts a Success to a Some", () => {
         expect(isSome(toOption(success(42)))).toBe(true)
      })

      it("preserves the value from a Success", () => {
         expect(optionOrElse(-1)(toOption(success(42)))).toBe(42)
      })

      it("converts a Failure to a None", () => {
         expect(isNone(toOption(failure("oops")))).toBe(true)
      })

      it("discards the error when converting a Failure", () => {
         expect(isNone(toOption(failure("oops", new Error("detail"))))).toBe(true)
      })

      it("works with falsy Success values", () => {
         expect(isSome(toOption(success(0)))).toBe(true)
         expect(optionOrElse(-1)(toOption(success(0)))).toBe(0)
      })

      it("works with string Success values", () => {
         expect(optionOrElse("")(toOption(success("hello")))).toBe("hello")
      })
   })

   describe("sequence", () => {
      it("returns Some when all options are Some", () => {
         expect(isSome(sequence(from([some(1), some(2), some(3)])))).toBe(true)
      })

      it("unwraps each Some value into the result list", () => {
         const result = sequence(from([some(1), some(2), some(3)]))
         if (!isSome(result)) throw new Error("expected Some")
         expect(toList(result.value)).toEqual([1, 2, 3])
      })

      it("returns None when any option is None", () => {
         expect(isNone(sequence(from([some(1), none<number>(), some(3)])))).toBe(true)
      })

      it("returns None when the first option is None", () => {
         expect(isNone(sequence(from([none<number>(), some(2), some(3)])))).toBe(true)
      })

      it("returns None when the last option is None", () => {
         expect(isNone(sequence(from([some(1), some(2), none<number>()])))).toBe(true)
      })

      it("returns None when all options are None", () => {
         expect(isNone(sequence(from([none<number>(), none<number>()])))).toBe(true)
      })

      it("returns Some with an empty list for an empty sequence", () => {
         const result = sequence(from<never>([]))
         expect(isSome(result)).toBe(true)
         if (!isSome(result)) throw new Error("expected Some")
         expect(toList(result.value)).toEqual([])
      })

      it("returns Some for a single Some", () => {
         const result = sequence(from([some(42)]))
         if (!isSome(result)) throw new Error("expected Some")
         expect(toList(result.value)).toEqual([42])
      })

      it("returns None for a single None", () => {
         expect(isNone(sequence(from([none<number>()])))).toBe(true)
      })
   })

})
