import { describe, expect, it } from "vitest";
import { toFloatOption, toFloatResult, toIntOption, toIntResult } from "../src/numbers.ts";
import { isNone, isSome } from "../src/option.ts";
import { isFailure, isOk } from "../src/result.ts";

describe("numbers", () => {

   describe("parse string to int option", () => {
      it("should return none with an empty string", () => {
         const result = toIntOption("")
         expect(isNone(result)).toBeTruthy()
      })

      it("should return none with a null or undefined string", () => {
         //@ts-ignore
         const result = toIntOption()
         expect(isNone(result)).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toIntOption("NO DIGITS")
         expect(isNone(result)).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toIntOption("123")
         expect(isSome(result)).toBeTruthy()
         expect(result.orElse(-1)).toEqual(123)
      })

      it("should return none with no digits", () => {
         const result = toIntOption("123.456")
         expect(isSome(result)).toBeTruthy()
         expect(result.orElse(-1)).toEqual(123)
      })
   })

   describe("parse string to float option", () => {
      it("should return none with an empty string", () => {
         const result = toFloatOption("")
         expect(isNone(result)).toBeTruthy()
      })

      it("should return none with a null or undefined string", () => {
         //@ts-ignore
         const result = toFloatOption()
         expect(isNone(result)).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toFloatOption("NO DIGITS")
         expect(isNone(result)).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toFloatOption("123")
         expect(isSome(result)).toBeTruthy()
         expect(result.orElse(-1)).toEqual(123)
      })

      it("should return none with no digits", () => {
         const result = toFloatOption("123.456")
         expect(isSome(result)).toBeTruthy()
         expect(result.orElse(-1)).toEqual(123.456)
      })
   })

   describe("parse string to int result", () => {
      it("should return none with an empty string", () => {
         const result = toIntResult("")
         expect(isFailure(result)).toBeTruthy()
      })

      it("should return none with a null or undefined string", () => {
         //@ts-ignore
         const result = toIntResult()
         expect(isFailure(result)).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toIntResult("NO DIGITS")
         expect(isFailure(result)).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toIntResult("123")
         expect(isOk(result)).toBeTruthy()
         expect(result.orElse(-1)).toEqual(123.0)
      })

      it("should return none with no digits", () => {
         const result = toIntResult("123.456")
         expect(isOk(result)).toBeTruthy()
         expect(result.orElse(-1)).toEqual(123)
      })
   })

   describe.skip("parse string to float result", () => {
      it("should return none with an empty string", () => {
         const result = toFloatResult("")
         expect(isFailure(result)).toBeTruthy()
      })

      it("should return none with a null or undefined string", () => {
         //@ts-ignore
         const result = toFloatResult()
         expect(isFailure(result)).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toFloatResult("NO DIGITS")
         expect(isFailure(result)).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toFloatResult("123.0")
         expect(isOk(result)).toBeTruthy()
         expect(result.orElse(-1)).toEqual(123.0)
      })

      it("should return none with no digits", () => {
         const result = toFloatResult("123.456")
         expect(isOk(result)).toBeTruthy()
         expect(result.orElse(-1)).toEqual(123)
      })
   })

})