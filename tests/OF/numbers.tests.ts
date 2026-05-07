import { describe, expect, it } from "vitest";
import { toFloatOption, toFloatResult, toIntOption, toIntResult } from "../../src/OF/numbers";

describe("OF.Numbers", () => {

   describe("toIntOption", () => {
      it("returns None for an empty string", () => {
         expect(toIntOption("").isNone).toBe(true)
      })

      it("returns None for null or undefined", () => {
         //@ts-ignore
         expect(toIntOption().isNone).toBe(true)
      })

      it("returns None for a non-numeric string", () => {
         expect(toIntOption("NO DIGITS").isNone).toBe(true)
      })

      it("returns Some wrapping the parsed integer", () => {
         expect(toIntOption("123").orElse(-1)).toBe(123)
      })

      it("truncates a float string to an integer", () => {
         expect(toIntOption("123.456").orElse(-1)).toBe(123)
      })
   })

   describe("toFloatOption", () => {
      it("returns None for an empty string", () => {
         expect(toFloatOption("").isNone).toBe(true)
      })

      it("returns None for null or undefined", () => {
         //@ts-ignore
         expect(toFloatOption().isNone).toBe(true)
      })

      it("returns None for a non-numeric string", () => {
         expect(toFloatOption("NO DIGITS").isNone).toBe(true)
      })

      it("returns Some wrapping an integer string as a float", () => {
         expect(toFloatOption("123").orElse(-1)).toBe(123)
      })

      it("returns Some wrapping the full decimal value", () => {
         expect(toFloatOption("123.456").orElse(-1)).toBe(123.456)
      })
   })

   describe("toIntResult", () => {
      it("returns Failure for an empty string", () => {
         expect(toIntResult("").isFailure).toBe(true)
      })

      it("returns Failure for null or undefined", () => {
         //@ts-ignore
         expect(toIntResult().isFailure).toBe(true)
      })

      it("returns Failure for a non-numeric string", () => {
         expect(toIntResult("NO DIGITS").isFailure).toBe(true)
      })

      it("returns Success wrapping the parsed integer", () => {
         expect(toIntResult("123").orElse(-1)).toBe(123)
      })

      it("truncates a float string to an integer", () => {
         expect(toIntResult("123.456").orElse(-1)).toBe(123)
      })
   })

   describe("toFloatResult", () => {
      it("returns Failure for an empty string", () => {
         expect(toFloatResult("").isFailure).toBe(true)
      })

      it("returns Failure for null or undefined", () => {
         //@ts-ignore
         expect(toFloatResult().isFailure).toBe(true)
      })

      it("returns Failure for a non-numeric string", () => {
         expect(toFloatResult("NO DIGITS").isFailure).toBe(true)
      })

      it("returns Success wrapping an integer string as a float", () => {
         expect(toFloatResult("123.0").orElse(-1)).toBe(123.0)
      })

      it("returns Success wrapping the full decimal value", () => {
         expect(toFloatResult("123.456").orElse(-1)).toBe(123.456)
      })
   })

})
