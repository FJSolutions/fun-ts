import { describe, expect, it, vi } from "vitest";
import { from } from "../src/sequence";

describe("Sequence", () => {

   describe("from / construction", () => {
      it("should have kind 'Seq'", () => {
         expect(from([1, 2, 3]).kind).toBe("Seq")
      })

      it("should be iterable", () => {
         const items = [...from([1, 2, 3])]
         expect(items).toEqual([1, 2, 3])
      })

      it("should accept an empty array", () => {
         expect(from([]).toList()).toEqual([])
      })

      it("should accept a generator as the source", () => {
         function* gen() {
            yield 1;
            yield 2;
            yield 3
         }

         expect(from(gen()).toList()).toEqual([1, 2, 3])
      })

      it("should accept a Set as the source", () => {
         expect(from(new Set([1, 2, 3])).toList()).toEqual([1, 2, 3])
      })
   })

   describe("toList", () => {
      it("should materialise the sequence into an array", () => {
         expect(from([1, 2, 3]).toList()).toEqual([1, 2, 3])
      })

      it("should return an empty array for an empty sequence", () => {
         expect(from([]).toList()).toEqual([])
      })
   })

   describe("isEmpty", () => {
      it("should be false for a non-empty sequence", () => {
         expect(from([1, 2, 3]).isEmpty).toBeFalsy()
      })

      it("should be true for an empty sequence", () => {
         expect(from([]).isEmpty).toBeTruthy()
      })
   })

   describe("map", () => {
      it("should transform each element", () => {
         expect(from([1, 2, 3]).map(x => x * 2).toList()).toEqual([2, 4, 6])
      })

      it("should map to a different type", () => {
         expect(from([1, 2, 3]).map(x => `${x}`).toList()).toEqual(["1", "2", "3"])
      })

      it("should return an empty sequence when the source is empty", () => {
         expect(from<number>([]).map(x => x * 2).toList()).toEqual([])
      })

      it("should chain multiple maps", () => {
         const result = from([1, 2, 3])
            .map(x => x + 1)
            .map(x => x * 2)
            .toList()
         expect(result).toEqual([4, 6, 8])
      })
   })

   describe("filter", () => {
      it("should keep only elements that satisfy the predicate", () => {
         expect(from([1, 2, 3, 4, 5]).filter(x => x % 2 === 0).toList()).toEqual([2, 4])
      })

      it("should return an empty sequence when no elements satisfy the predicate", () => {
         expect(from([1, 3, 5]).filter(x => x % 2 === 0).toList()).toEqual([])
      })

      it("should return all elements when all satisfy the predicate", () => {
         expect(from([2, 4, 6]).filter(x => x % 2 === 0).toList()).toEqual([2, 4, 6])
      })

      it("should chain with map", () => {
         const result = from([1, 2, 3, 4, 5])
            .filter(x => x % 2 !== 0)
            .map(x => x * 10)
            .toList()
         expect(result).toEqual([10, 30, 50])
      })
   })

   describe("fold", () => {
      it("should accumulate values using the folder function", () => {
         const result = from([1, 2, 3, 4]).fold((acc, x) => acc + x, 0)
         expect(result).toEqual(10)
      })

      it("should use the initial value as the starting accumulator", () => {
         const result = from([1, 2, 3]).fold((acc, x) => acc + x, 10)
         expect(result).toEqual(16)
      })

      it("should return a sequence containing the initial value for an empty source", () => {
         const result = from<number>([]).fold((acc, x) => acc + x, 0)
         expect(result).toEqual(0)
      })

      it("should fold into a different type", () => {
         const result = from([1, 2, 3]).fold((acc, x) => `${acc},${x}`, "values")
         expect(result).toEqual("values,1,2,3")
      })
   })

   describe("flatMap", () => {
      it("should flatten one level of nested sequences", () => {
         const result = from([1, 2, 3])
            .flatMap(x => from([x, x * 10]))
            .toList()
         expect(result).toEqual([1, 10, 2, 20, 3, 30])
      })

      it("should return an empty sequence when the source is empty", () => {
         const result = from<number>([]).flatMap(x => from([x, x * 2])).toList()
         expect(result).toEqual([])
      })

      it("should return an empty sequence when the mapper always returns empty", () => {
         const result = from([1, 2, 3]).flatMap(_ => from([])).toList()
         expect(result).toEqual([])
      })

      it("should chain with filter", () => {
         const result = from([1, 2, 3])
            .flatMap(x => from([x, x + 10]))
            .filter(x => x > 5)
            .toList()
         expect(result).toEqual([11, 12, 13])
      })
   })

   describe("take", () => {
      it("should return at most the specified number of elements", () => {
         expect(from([1, 2, 3, 4, 5]).take(3).toList()).toEqual([1, 2, 3])
      })

      it("should return all elements when count exceeds the sequence length", () => {
         expect(from([1, 2, 3]).take(10).toList()).toEqual([1, 2, 3])
      })

      it("should return an empty sequence when count is zero", () => {
         expect(from([1, 2, 3]).take(0).toList()).toEqual([])
      })

      it("should work on an infinite generator", () => {
         function* naturals() {
            let i = 1;
            while (true) yield i++
         }

         expect(from(naturals()).take(5).toList()).toEqual([1, 2, 3, 4, 5])
      })
   })

   describe("skip", () => {
      it("should skip the first n elements", () => {
         expect(from([1, 2, 3, 4, 5]).skip(2).toList()).toEqual([3, 4, 5])
      })

      it("should return an empty sequence when count equals the sequence length", () => {
         expect(from([1, 2, 3]).skip(3).toList()).toEqual([])
      })

      it("should return an empty sequence when count exceeds the sequence length", () => {
         expect(from([1, 2, 3]).skip(10).toList()).toEqual([])
      })

      it("should return the full sequence when count is zero", () => {
         expect(from([1, 2, 3]).skip(0).toList()).toEqual([1, 2, 3])
      })

      it("should compose with take for pagination", () => {
         const page2 = from([1, 2, 3, 4, 5, 6, 7, 8, 9]).skip(3).take(3).toList()
         expect(page2).toEqual([4, 5, 6])
      })
   })

   describe("tap", () => {
      it("should call the function for each element", () => {
         const seen: number[] = []
         from([1, 2, 3]).tap(x => seen.push(x)).toList()
         expect(seen).toEqual([1, 2, 3])
      })

      it("should not modify the elements", () => {
         const result = from([1, 2, 3]).tap(() => {
         }).toList()
         expect(result).toEqual([1, 2, 3])
      })

      it("should not invoke the function until the sequence is realised", () => {
         const fn = vi.fn()
         const seq = from([1, 2, 3]).tap(fn)
         expect(fn).not.toHaveBeenCalled()
         seq.toList()
         expect(fn).toHaveBeenCalledTimes(3)
      })
   })

})
