import { describe, expect, it } from "vitest";
import { toFloatOption, toFloatResult, toIntOption, toIntResult } from "../src/numbers";

describe("numbers", () => {

   describe("parse string to int option", () => {
      it("should return none with an empty string", () => {
         const result = toIntOption("").isNone
         expect(result).toBeTruthy()
      })

      it("should return none with a null or undefined string", () => {
         //@ts-ignore
         const result = toIntOption().isNone
         expect(result).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toIntOption("NO DIGITS").isNone
         expect(result).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toIntOption("123")
         expect(result.orElse(-1)).toEqual(123)
      })

      it("should return none with no digits", () => {
         const result = toIntOption("123.456")
         expect(result.orElse(-1)).toEqual(123)
      })
   })

   describe("parse string to float option", () => {
      it("should return none with an empty string", () => {
         const result = toFloatOption("").isNone
         expect(result).toBeTruthy()
      })

      it("should return none with a null or undefined string", () => {
         //@ts-ignore
         const result = toFloatOption().isNone
         expect(result).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toFloatOption("NO DIGITS").isNone
         expect(result).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toFloatOption("123")
         expect(result.orElse(-1)).toEqual(123)
      })

      it("should return none with no digits", () => {
         const result = toFloatOption("123.456")
         expect(result.orElse(-1)).toEqual(123.456)
      })
   })

   describe("parse string to int result", () => {
      it("should return none with an empty string", () => {
         const result = toIntResult("").isFailure
         expect(result).toBeTruthy()
      })

      it("should return none with a null or undefined string", () => {
         //@ts-ignore
         const result = toIntResult().isFailure
         expect(result).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toIntResult("NO DIGITS").isFailure
         expect(result).toBeTruthy()
      })

      it("should return none with no digits", () => {
         const result = toIntResult("123")
         expect(result.orElse(-1)).toEqual(123.0)
      })

      it("should return none with no digits", () => {
         const result = toIntResult("123.456")
         expect(result.orElse(-1)).toEqual(123)
      })
   })

   describe("parse string to float result", () => {
      it("should return failure with an empty string", () => {
         const result = toFloatResult("").isFailure
         expect(result).toBeTruthy()
      })

      it("should return failure with a null or undefined string", () => {
         //@ts-ignore
         const result = toFloatResult().isFailure
         expect(result).toBeTruthy()
      })

      it("should return failure with no digits", () => {
         const result = toFloatResult("NO DIGITS").isFailure
         expect(result).toBeTruthy()
      })

      it("should return failure with no digits", () => {
         const result = toFloatResult("123.0")
         expect(result.orElse(-1)).toEqual(123.0)
      })

      it("should return none with no digits", () => {
         const result = toFloatResult("123.456")
         expect(result.orElse(-1)).toEqual(123.456)
      })
   })

})