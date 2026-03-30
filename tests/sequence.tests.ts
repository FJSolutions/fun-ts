import { describe, expect, it } from "vitest";
import * as Seq from "../src/sequence";

describe("Sequence", () => {
   describe.skip("fold", () => {
      //! TODO:
   })

   describe.skip("map", () => {
      //! TODO:
   })

   describe.skip("filter", () => {
      //! TODO:
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
   })
})
