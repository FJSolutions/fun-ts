import { describe, expect, it } from "vitest";
import * as Seq from "../src/sequence";
import { filter } from "../src/sequence";

describe("Sequence", () => {
   describe.skip("fold", () => {
      //! TODO:
   })

   describe("map", () => {
      it("should map array items to add one", () => {
         const source = [1, 2, 3, 4, 5]

         const result = (Seq.map((item: number) => item + 1)(source)).toList()

         expect(result).toEqual([2, 3, 4, 5, 6])
      })
   })

   describe("filter", () => {
      it("should filter out even numbers", () => {
         const source = [1, 2, 3, 4, 5, 6]

         const seq = filter((item: number) => item % 2 === 0)(source)
         const result = seq.toList()

         expect(result).toEqual([2, 4, 6])
      })

      it("should filter out odd numbers", () => {
         const source = [1, 2, 3, 4, 5, 6]

         const seq = filter((item: number) => item % 2 !== 0)(source)
         const result = seq.toList()

         expect(result).toEqual([1, 3, 5])
      })
   })

   describe.skip("flatMap", () => {
      //! TODO:
   })

   describe("take & limit", () => {
      it('should take 3 from an array of 5', () => {
         const source = [1, 2, 3, 4, 5];

         // const seq = Seq.take(3)(source)
         const seq = Seq.take(3)(source)
         const arr = seq.toList()

         expect(arr.length).toBe(3)
         expect(arr).toEqual([1, 2, 3])
      });

      it('should limit the results to 3 from an array of 5', () => {
         const source = [1, 2, 3, 4, 5];

         const arr =
            Seq.limit(3, source)
               .toList()

         expect(arr.length).toBe(3)
         expect(arr).toEqual([1, 2, 3])
      });

      it('should take 5 from a list of 5', () => {
         const source = [1, 2, 3, 4, 5];

         const seq = Seq.take(5)(source)
         const arr = Seq.toList(seq)

         expect(arr.length).toBe(5)
         expect(arr).toEqual([1, 2, 3, 4, 5])
      });

      it('should have no effect on an 5 from a list of 5 when take is 7', () => {
         const source = [1, 2, 3, 4, 5];

         const seq = Seq.take(7)(source)
         const arr = Seq.toList(seq)

         expect(arr.length).toBe(5)
         expect(arr).toEqual([1, 2, 3, 4, 5])
      });
   })

   describe("skip & offset", () => {
      it('should skip 3 from an array of 5', () => {
         const source = [1, 2, 3, 4, 5];

         const seq = Seq.skip(3)(source)
         const arr = Seq.toList(seq)

         expect(arr.length).toBe(2)
         expect(arr).toEqual([4, 5])
      });

      it('should offset 3 from an array of 5', () => {
         const source = [1, 2, 3, 4, 5];

         const arr = Seq.offset(3, source).toList()

         expect(arr.length).toBe(2)
         expect(arr).toEqual([4, 5])
      });

      it('should skip 5 from a list of 5', () => {
         const source = [1, 2, 3, 4, 5];

         const seq = Seq.skip(5)(source)
         const arr = Seq.toList(seq)

         expect(arr.length).toBe(0)
         expect(arr).toEqual([])
      });

      it('should have no effect on an 5 from a list of 5 when skip is 0', () => {
         const source = [1, 2, 3, 4, 5];

         const seq = Seq.skip(0)(source)
         const arr = Seq.toList(seq)

         expect(arr.length).toBe(5)
         expect(arr).toEqual([1, 2, 3, 4, 5])
      });

      it("should tap into each item", () => {
         const source = [1, 2, 3, 4, 5]

         const result: number[] = []
         const seq = Seq.tap((item: number) => result.push(item))(source)

         expect(source).toEqual(seq.toList())
         expect(result).toEqual(source)
      })
   })
})

describe("sequence piping", () => {
   it("pipes a value through a sequence", () => {
      const source = [1, 2, 3, 4, 5];

      const seq = Seq.pipe(
         source,
         Seq.map(n => n + 1)
      )
      const result = seq.toList()
      // const result = Seq.map((i: number) => i + 1)(Seq.of(source)).toList()

      expect(result).toEqual([2, 3, 4, 5, 6])
   })
})
