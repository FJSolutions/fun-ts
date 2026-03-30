import { describe, expect, it } from "vitest";
import * as O from "../src/option.ts";

describe("Option", () => {
   it("should create an option with a value", () => {
      const option = O.some(1)
      expect(option.key).toBe("Some")
      expect(O.isSome(option)).toBeTruthy()
      expect(O.isNone(option)).toBeFalsy()
   })

   it("should create an option with no value", () => {
      const option = O.none()
      expect(O.isSome(option)).toBeFalsy()
      expect(O.isNone(option)).toBeTruthy()
   })

   it("should create an option with of no value", () => {
      const option = O.of(undefined)
      expect(O.isSome(option)).toBeFalsy()
      expect(O.isNone(option)).toBeTruthy()
   })

   it("should create an option with of a null value", () => {
      const option = O.of(null)
      expect(O.isSome(option)).toBeFalsy()
      expect(O.isNone(option)).toBeTruthy()
   })

   it("should match an option with a value", () => {
      const result =
         O.some(1)
            .match(
               () => "None",
               (value) => `Some(${value})`,
            )
      expect(result).toEqual("Some(1)")
   })

   it("should match an option with no value", () => {
      const option = O.none()
      const result = O.match(
         () => "None",
         (value) => `Some(${value})`,
      )(option)
      expect(result).toEqual("None")
   })

   it("should return a value from a some option", () => {
      const option = O.orElse(2)(O.some(1))
      expect(option).toEqual(1)
   })

   it("should return a value from a none option", () => {
      const option = O.none().orElse(2)
      expect(option).toEqual(2)
   })

   it("should return a piped value from some 1", () => {
      const res1 = O.pipe(
         O.some(1),
         O.lift((value) => value + 1)
      )
      const res2 = O.orElse(3)(res1)
      expect(res2).toEqual(2)
   })

   it("should return a piped value from none", () => {
      const res1 = O.pipe(
         O.none<number>(),
         O.lift((value) => value + 1),
         O.lift((value) => value.toString())
      )
      const res2 = O.orElse("3")(res1)
      expect(res2).toEqual("3")
   })
})