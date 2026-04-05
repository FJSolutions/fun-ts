import { describe, expect, it } from "vitest";
import * as S from "../../src/strings"

describe("strings", () => {
   it('should upper case an input string', () => {
      const result = S.toUpper("francis")
      expect(result).toEqual("FRANCIS")
   });

   it('should upper case an undefined input string', () => {
      //@ts-ignore
      const result = S.toUpper()
      expect(result).toEqual("")
   });

   it('should lower case an input string', () => {
      const result = S.toLower("FRANCIS")
      expect(result).toEqual("francis")
   });

   it('should capitalise an input string', () => {
      const result = S.capitalise("francis brian      judge")
      expect(result).toEqual("Francis Brian Judge")
   });

   it("should capitalise to sentence case", () => {
      const result = S.toSentence("francis brian     judge")
      expect(result).toEqual("Francis brian judge")
   })

   it("should convert a sentence to a Pascal case identifier", () => {
      const result = S.toPascal("francis brian     judge")
      expect(result).toEqual("FrancisBrianJudge")
   })

   it("should convert a hyphenated identifier to a Pascal case identifier", () => {
      const result = S.toPascal("francis-brian     judge")
      expect(result).toEqual("FrancisBrianJudge")
   })

   it("should convert an underscored identifier to a Pascal case identifier", () => {
      const result = S.toPascal("francis_brian  judge")
      expect(result).toEqual("FrancisBrianJudge")
   })

   it("should convert a sentence to a Camel case identifier", () => {
      const result = S.toCamel("francis brian     judge")
      expect(result).toEqual("francisBrianJudge")
   })

   it("should convert a sentence to snake case identifier", () => {
      const result = S.toSnake("francis Brian     judge")
      expect(result).toEqual("francis_brian_judge")
   })

   it("should convert a sentence to kebab case identifier", () => {
      const result = S.toKebab("francis Brian     judge")
      expect(result).toEqual("francis-brian-judge")
   })

   it("should convert a Pascal identifier to a Camel case identifier", () => {
      const result = S.toCamel("FrancisBrianJudge")
      expect(result).toEqual("francisBrianJudge")
   })

   it("should convert a Camel identifier to a Pascal case identifier", () => {
      const result = S.toPascal("francisBrianJudge")
      expect(result).toEqual("FrancisBrianJudge")
   })

   it("should convert a Kebab case identifier to a Pascal case identifier", () => {
      const result = S.toPascal("francis-brian-judge")
      expect(result).toEqual("FrancisBrianJudge")
   })

   it("should convert a Camel identifier to snake case identifier", () => {
      const result = S.toSnake("francisBrianJudge")
      expect(result).toEqual("francis_brian_judge")
   })
})