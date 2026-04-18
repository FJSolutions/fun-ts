import { describe, expect, it } from "vitest";
import { success, failure, isSuccess, isFailure, orElse, map, flatMap, filter, reduce, match, from } from "../../src/FP/result";
import type { Result } from "../../src/FP/types";

describe("FP.Result", () => {

   describe("success", () => {
      it("kind is 'Result'", () => {
         expect(success(42).kind).toBe("Result")
      })

      it("type is 'Success'", () => {
         expect(success(42).type).toBe("Success")
      })

      it("holds the wrapped value", () => {
         expect(success(42).value).toBe(42)
      })

      it("works with string values", () => {
         expect(success("hello").value).toBe("hello")
      })

      it("works with falsy values", () => {
         expect(success(0).value).toBe(0)
         expect(success(false).value).toBe(false)
      })

      it("works with object values", () => {
         const obj = { id: 1 }
         expect(success(obj).value).toBe(obj)
      })
   })

   describe("failure", () => {
      it("kind is 'Result'", () => {
         expect(failure("oops").kind).toBe("Result")
      })

      it("type is 'Failure'", () => {
         expect(failure("oops").type).toBe("Failure")
      })

      it("stores the message", () => {
         expect(failure("something went wrong").message).toBe("something went wrong")
      })

      it("stores the error when provided", () => {
         const err = new Error("boom")
         expect(failure("boom", err).error).toBe(err)
      })

      it("error is undefined when not provided", () => {
         expect(failure("oops").error).toBeUndefined()
      })
   })

   describe("isSuccess", () => {
      it("returns true for a Success", () => {
         expect(isSuccess(success(42))).toBe(true)
      })

      it("returns false for a Failure", () => {
         expect(isSuccess(failure("oops"))).toBe(false)
      })
   })

   describe("isFailure", () => {
      it("returns true for a Failure", () => {
         expect(isFailure(failure("oops"))).toBe(true)
      })

      it("returns false for a Success", () => {
         expect(isFailure(success(42))).toBe(false)
      })
   })

   describe("orElse", () => {
      it("returns the value for a Success", () => {
         expect(orElse(-1)(success(42))).toBe(42)
      })

      it("returns the default for a Failure", () => {
         const f: Result<number, undefined> = failure("oops")
         expect(orElse(-1)(f)).toBe(-1)
      })

      it("returns falsy wrapped values rather than the default", () => {
         expect(orElse(-1)(success(0))).toBe(0)
         expect(orElse(true)(success(false))).toBe(false)
      })
   })

   describe("map", () => {
      it("transforms the value inside a Success", () => {
         const double = map((x: number) => x * 2)
         expect(orElse(-1)(double(success(21)))).toBe(42)
      })

      it("passes the Failure through with its message intact", () => {
         const f: Result<number, undefined> = failure("oops")
         const result = map((x: number) => x * 2)(f)
         expect(match(() => "", msg => msg)(result)).toBe("oops")
      })

      it("preserves the Success structure after mapping", () => {
         expect(isSuccess(map((s: string) => s.length)(success("hello")))).toBe(true)
      })
   })

   describe("flatMap", () => {
      it("returns the inner Success when the outer is Success", () => {
         const double = flatMap((x: number): Result<number, never> => success(x * 2))
         expect(orElse(-1)(double(success(21)))).toBe(42)
      })

      it("passes the Failure through when the outer is Failure", () => {
         const f: Result<number, undefined> = failure("oops")
         const double = flatMap((x: number): Result<number, undefined> => success(x * 2))
         expect(match(() => "", msg => msg)(double(f))).toBe("oops")
      })

      it("returns the inner Failure when the mapping function returns Failure", () => {
         const toFailure = flatMap((_: number) => failure("inner failure"))
         const result = toFailure(success(42))
         expect(match(() => "", msg => msg)(result)).toBe("inner failure")
      })
   })

   describe("filter", () => {
      it("keeps a Success when the predicate passes", () => {
         const isAdult = filter((x: number) => x > 18, "too small")
         expect(orElse(-1)(isAdult(success(42)))).toBe(42)
      })

      it("returns Failure with the given message when the predicate fails", () => {
         const isAdult = filter((x: number) => x > 18, "too small")
         expect(match(() => "", msg => msg)(isAdult(success(10)))).toBe("too small")
      })

      it("passes an existing Failure through with its original message", () => {
         const f: Result<number, undefined> = failure("original error")
         const isAdult = filter((x: number) => x > 18, "filtered")
         expect(match(() => "", msg => msg)(isAdult(f))).toBe("original error")
      })
   })

   describe("reduce", () => {
      it("applies the accumulator to the value inside a Success", () => {
         const sum = reduce((acc: number, x: number) => acc + x, 0)
         expect(sum(success(42))).toBe(42)
      })

      it("returns the initial value for a Failure", () => {
         const f: Result<number, undefined> = failure("oops")
         const sum = reduce((acc: number, x: number) => acc + x, 0)
         expect(sum(f)).toBe(0)
      })

      it("accumulates into a different type", () => {
         const stringify = reduce((acc: string, x: number) => `${acc}${x}`, "value: ")
         expect(stringify(success(42))).toBe("value: 42")
      })
   })

   describe("match", () => {
      it("calls onSuccess with the value for a Success", () => {
         const fmt = match((x: number) => `ok(${x})`, () => "fail")
         expect(fmt(success(42))).toBe("ok(42)")
      })

      it("calls onFailure with the message for a Failure", () => {
         const fmt = match(() => "ok", (msg: string) => msg)
         expect(fmt(failure("not found"))).toBe("not found")
      })

      it("calls onFailure with the error for a typed Failure", () => {
         const err = new Error("boom")
         const fmt = match(() => "", (_msg: string, e: Error) => e.message)
         expect(fmt(failure("boom", err))).toBe("boom")
      })
   })

   describe("from", () => {
      it("returns a Success when the function does not throw", () => {
         const result = from(() => 42)
         expect(isSuccess(result)).toBe(true)
         expect(orElse(-1)(result)).toBe(42)
      })

      it("returns a Failure when the function throws an Error", () => {
         const result = from(() => { throw new Error("boom") })
         expect(match(() => "", msg => msg)(result)).toBe("boom")
      })

      it("wraps a non-Error throw in an Error", () => {
         const result = from(() => { throw "string error" })
         expect(match(() => "", msg => msg)(result)).toBe("string error")
      })

      it("stores the original Error on the Failure", () => {
         const err = new Error("original")
         const result = from(() => { throw err })
         if (!isFailure(result)) throw new Error("expected Failure")
         expect(result.error).toBe(err)
      })
   })

})
