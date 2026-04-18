import { describe, expect, it } from "vitest";
import { failure, success } from "../../src/OF/result/result-transforms";

describe("result-transforms", () => {

   describe("success", () => {
      it("should create a Success with correct kind and tag", () => {
         const result = success(42)
         expect(result.kind).toBe("Result")
         expect(result.tag).toBe("Success")
         expect(result.isSuccess).toBeTruthy()
         expect(result.isFailure).toBeFalsy()
      })

      it("should return the value via orElse", () => {
         expect(success(42).orElse(-1)).toBe(42)
      })

      it("should convert to a Some option", () => {
         const opt = success(42).toOption()
         expect(opt.isSome).toBeTruthy()
         expect(opt.isNone).toBeFalsy()
         expect(opt.orElse(-1)).toBe(42)
      })

      it("should carry the value faithfully into the Some option", () => {
         const opt = success("hello").toOption()
         expect(opt.isSome).toBeTruthy()
         expect(opt.orElse("default")).toBe("hello")
      })

      it("should convert an object value to a Some option", () => {
         const obj = {id: 1, name: "alice"}
         const opt = success(obj).toOption()
         expect(opt.isSome).toBeTruthy()
         expect(opt.orElse({id: 0, name: ""})).toEqual({id: 1, name: "alice"})
      })

      it("should convert zero to a Some option", () => {
         const opt = success(0).toOption()
         expect(opt.isSome).toBeTruthy()
         expect(opt.orElse(-1)).toBe(0)
      })

      it("should convert false to a Some option", () => {
         const opt = success(false).toOption()
         expect(opt.isSome).toBeTruthy()
         expect(opt.orElse(true)).toBe(false)
      })
   })

   describe("failure", () => {
      it("should create a Failure with correct kind and tag", () => {
         const result = failure("oops")
         expect(result.kind).toBe("Result")
         expect(result.tag).toBe("Failure")
         expect(result.isFailure).toBeTruthy()
         expect(result.isSuccess).toBeFalsy()
      })

      it("should return the default value via orElse", () => {
         expect(failure<number>("oops").orElse(-1)).toBe(-1)
      })

      it("should convert to a None option", () => {
         const opt = failure<number>("oops").toOption()
         expect(opt.isNone).toBeTruthy()
         expect(opt.isSome).toBeFalsy()
      })

      it("should produce the default value from the None option", () => {
         const opt = failure<number>("oops").toOption()
         expect(opt.orElse(-99)).toBe(-99)
      })

      it("should accept an optional Error and still produce a None option", () => {
         const error = new Error("root cause")
         const opt = failure<number>("oops", error).toOption()
         expect(opt.isNone).toBeTruthy()
      })

      it("should produce distinct None options for distinct failure messages", () => {
         const opt1 = failure<number>("first").toOption()
         const opt2 = failure<number>("second").toOption()
         expect(opt1.isNone).toBeTruthy()
         expect(opt2.isNone).toBeTruthy()
      })
   })

   describe("EitherTransformer", () => {
      it("should be constructable as a Success", () => {
         const t = success(42)
         expect(t.isSuccess).toBeTruthy()
         expect(t.orElse(-1)).toBe(42)
      })

      it("should be constructable as a Failure", () => {
         const t = failure<number>("error")
         expect(t.isFailure).toBeTruthy()
         expect(t.orElse(-1)).toBe(-1)
      })

      it("should convert a Success to a Some option", () => {
         const opt = success(99).toOption()
         expect(opt.isSome).toBeTruthy()
         expect(opt.orElse(-1)).toBe(99)
      })

      it("should convert a Failure to a None option", () => {
         const opt = failure<number>("error").toOption()
         expect(opt.isNone).toBeTruthy()
      })
   })

   describe("inherited Result behaviour", () => {
      it("should map a Success value", () => {
         expect(success(21).map(x => x * 2).orElse(-1)).toBe(42)
      })

      it("should leave a Failure unchanged through map", () => {
         expect(failure<number>("oops").map(x => x * 2).orElse(-1)).toBe(-1)
      })

      it("should flatMap a Success to another Success", () => {
         expect(success(21).flatMap(x => success(x * 2)).orElse(-1)).toBe(42)
      })

      it("should leave a Failure unchanged through flatMap", () => {
         expect(failure<number>("oops").flatMap(x => success(x * 2)).orElse(-1)).toBe(-1)
      })

      it("should match a Success", () => {
         const r = success(42).match(v => `ok:${v}`, () => "fail")
         expect(r).toBe("ok:42")
      })

      it("should match a Failure and include the error message", () => {
         const r = failure<number>("something went wrong").match(() => "ok", msg => `fail:${msg}`)
         expect(r).toBe("fail:something went wrong")
      })

      it("should pass the Error object to the failure branch", () => {
         const error = new Error("root cause")
         const r = failure<number>("oops", error).match(() => null, (_msg, err) => err)
         expect(r).toBe(error)
      })

      it("should filter in a passing value", () => {
         expect(success(42).filter(x => x > 0).isSuccess).toBeTruthy()
      })

      it("should filter out a failing value", () => {
         expect(success(42).filter(x => x < 0).isFailure).toBeTruthy()
      })
   })

})
