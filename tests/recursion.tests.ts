import { describe, expect, it } from "vitest";
import { recurse } from "../src/recursion";

describe("Recurse", () => {

   describe("Ironing out the API", () => {
      it("should infer parameters from the processor function for the conditional", () => {
         const result = recurse(
            [1, 2, 3, 4, 5],
            new Array<number>(),
            (source) => source.length > 0,
            (source, acc) => {
               const value = source[0]!
               return [source.splice(1), [...acc, value]];
            })
         expect(result.length).toBe(5)
         expect(result[0]).toBe(1)
      })
      it("Throws an error if the recursion depth has been exceeded", () => {
         expect(() =>
            recurse(
               [1, 2, 3, 4, 5],
               new Array<number>(),
               (source) => source.length > 0,
               (source, acc) => {
                  const value = source[0]!
                  return [source.splice(1), [...acc, value]];
               },
               {depth: 1})
         ).toThrow()
      })
   })

})