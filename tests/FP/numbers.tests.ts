import { describe, expect, it } from "vitest";
import { toFloatOption, toFloatResult, toIntOption, toIntResult } from "../../src/FP/numbers";
import { isSome, isNone, orElse as optOrElse } from "../../src/FP/option";
import { isSuccess, isFailure, orElse as resOrElse, match } from "../../src/FP/result";

describe("FP.Numbers", () => {

   describe("toIntOption", () => {
      it("returns None for an empty string", () => {
         expect(isNone(toIntOption(""))).toBe(true)
      })

      it("returns None for null or undefined", () => {
         //@ts-ignore
         expect(isNone(toIntOption())).toBe(true)
      })

      it("returns None for a non-numeric string", () => {
         expect(isNone(toIntOption("NO DIGITS"))).toBe(true)
      })

      it("returns Some wrapping the parsed integer", () => {
         expect(isSome(toIntOption("123"))).toBe(true)
         expect(optOrElse(-1)(toIntOption("123"))).toBe(123)
      })

      it("truncates a float string to an integer", () => {
         expect(optOrElse(-1)(toIntOption("123.456"))).toBe(123)
      })
   })

   describe("toFloatOption", () => {
      it("returns None for an empty string", () => {
         expect(isNone(toFloatOption(""))).toBe(true)
      })

      it("returns None for null or undefined", () => {
         //@ts-ignore
         expect(isNone(toFloatOption())).toBe(true)
      })

      it("returns None for a non-numeric string", () => {
         expect(isNone(toFloatOption("NO DIGITS"))).toBe(true)
      })

      it("returns Some wrapping an integer string as a float", () => {
         expect(isSome(toFloatOption("123"))).toBe(true)
         expect(optOrElse(-1)(toFloatOption("123"))).toBe(123)
      })

      it("returns Some wrapping the full decimal value", () => {
         expect(optOrElse(-1)(toFloatOption("123.456"))).toBe(123.456)
      })
   })

   describe("toIntResult", () => {
      it("returns Failure for an empty string", () => {
         expect(isFailure(toIntResult(""))).toBe(true)
      })

      it("returns Failure for null or undefined", () => {
         //@ts-ignore
         expect(isFailure(toIntResult())).toBe(true)
      })

      it("returns Failure for a non-numeric string", () => {
         expect(isFailure(toIntResult("NO DIGITS"))).toBe(true)
      })

      it("returns Success wrapping the parsed integer", () => {
         expect(isSuccess(toIntResult("123"))).toBe(true)
         expect(resOrElse(-1)(toIntResult("123"))).toBe(123)
      })

      it("truncates a float string to an integer", () => {
         expect(resOrElse(-1)(toIntResult("123.456"))).toBe(123)
      })

      it("Failure carries an Error on null or undefined input", () => {
         //@ts-ignore
         const result = toIntResult()
         expect(match(() => null, (_msg, err: Error) => err)(result)).toBeInstanceOf(Error)
      })

      it("Failure carries an Error on non-numeric input", () => {
         const result = toIntResult("abc")
         expect(match(() => null, (_msg, err: Error) => err)(result)).toBeInstanceOf(Error)
      })
   })

   describe("toFloatResult", () => {
      it("returns Failure for an empty string", () => {
         expect(isFailure(toFloatResult(""))).toBe(true)
      })

      it("returns Failure for null or undefined", () => {
         //@ts-ignore
         expect(isFailure(toFloatResult())).toBe(true)
      })

      it("returns Failure for a non-numeric string", () => {
         expect(isFailure(toFloatResult("NO DIGITS"))).toBe(true)
      })

      it("returns Success wrapping an integer string as a float", () => {
         expect(isSuccess(toFloatResult("123.0"))).toBe(true)
         expect(resOrElse(-1)(toFloatResult("123.0"))).toBe(123.0)
      })

      it("returns Success wrapping the full decimal value", () => {
         expect(resOrElse(-1)(toFloatResult("123.456"))).toBe(123.456)
      })

      it("Failure carries an Error on null or undefined input", () => {
         //@ts-ignore
         const result = toFloatResult()
         expect(match(() => null, (_msg, err: Error) => err)(result)).toBeInstanceOf(Error)
      })

      it("Failure carries an Error on non-numeric input", () => {
         const result = toFloatResult("abc")
         expect(match(() => null, (_msg, err: Error) => err)(result)).toBeInstanceOf(Error)
      })
   })

})
