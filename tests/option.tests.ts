import { describe, expect, it } from "vitest";
import { none, lift, some } from "../src/option";

describe("Option", () => {
   it("Should be able to create a Some Option", () => {
      const result = some(42)
      expect(result.kind).toBe("Option")
      expect(result.tag).toBe("Some");
      expect(result.isSome).toBeTruthy();
      expect(result.isNone).toBeFalsy();
      expect(result.orElse(-1)).toBe(42);
   })

   it("Should be able to create a None Option", () => {
      const result = none()
      expect(result.kind).toBe("Option")
      expect(result.tag).toBe("None");
      expect(result.isSome).toBeFalsy();
      expect(result.isNone).toBeTruthy();
      expect(result.orElse(-1)).toBe(-1);
   })

   it("should map a value from the given Some option", () => {
      const result =
         some(36)
            .map(value => value + 6)
            .orElse(-1)
      expect(result).toBe(42);
   })

   it("should map a value from the given None option", () => {
      const result =
         none<number>()
            .map((value) => value + 6)
            .orElse(-1)
      expect(result).toBe(-1);
   })

   it("should bind a value from a Some option", () => {
      const result =
         some(21)
            .flatMap(value => some(value * 2))
            .orElse(-1)
      expect(result).toBe(42)
   })

   it("should return None when binding a None option", () => {
      const result =
         none<number>()
            .flatMap(value => some(value * 2))
            .orElse(-1)
      expect(result).toBe(-1)
   })

   it("should return None when bind returns None", () => {
      const result =
         some(42)
            .flatMap(_ => none<number>())
            .orElse(-1)
      expect(result).toBe(-1)
   })

   it("should match a Some option", () => {
      const result =
         some(42)
            .match(
               value => `Some(${value})`,
               () => "None"
            )
      expect(result).toBe("Some(42)")
   })

   it("should match a None option", () => {
      const result =
         none<number>()
            .match(
               value => `Some(${value})`,
               () => "None"
            )
      expect(result).toBe("None")
   })

   it("should create a Some from a non-null value with of", () => {
      const result = lift(42)
      expect(result.isSome).toBeTruthy()
      expect(result.orElse(-1)).toBe(42)
   })

   it("should create a None from undefined with of", () => {
      const result = lift(undefined)
      expect(result.isNone).toBeTruthy()
   })

   it("should create a None from null with of", () => {
      const result = lift(null)
      expect(result.isNone).toBeTruthy()
   })
})