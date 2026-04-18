import { describe, expect, it } from "vitest";
import { from, toList, isEmpty, map, flatMap, filter, reduce, take, skip, tap, collect, all, any } from "../../src/FP/sequence";
import { pipe } from "../../src/pipe"

describe("FP.Sequence", () => {

   describe("from", () => {
      it("creates a sequence from an array", () => {
         expect(toList(from([1, 2, 3]))).toEqual([1, 2, 3])
      })

      it("creates a sequence from a Set", () => {
         expect(toList(from(new Set([1, 2, 3])))).toEqual([1, 2, 3])
      })

      it("creates an empty sequence from an empty array", () => {
         expect(toList(from([]))).toEqual([])
      })

      it("is iterable multiple times", () => {
         const seq = from([1, 2, 3])
         expect(toList(seq)).toEqual([1, 2, 3])
         expect(toList(seq)).toEqual([1, 2, 3])
      })
   })

   describe("toList", () => {
      it("materialises the sequence into an array", () => {
         expect(toList(from([1, 2, 3]))).toEqual([1, 2, 3])
      })

      it("returns an empty array for an empty sequence", () => {
         expect(toList(from([]))).toEqual([])
      })
   })

   describe("isEmpty", () => {
      it("returns true for an empty sequence", () => {
         expect(isEmpty(from([]))).toBe(true)
      })

      it("returns false for a non-empty sequence", () => {
         expect(isEmpty(from([1]))).toBe(false)
      })
   })

   describe("map", () => {
      it("transforms each element", () => {
         expect(toList(map((x: number) => x * 2)(from([1, 2, 3])))).toEqual([2, 4, 6])
      })

      it("returns an empty sequence when the source is empty", () => {
         expect(toList(map((x: number) => x * 2)(from([])))).toEqual([])
      })

      it("is lazy — does not evaluate until consumed", () => {
         let calls = 0
         const seq = map((x: number) => {
            calls++;
            return x * 2
         })(from([1, 2, 3]))
         expect(calls).toBe(0)
         toList(seq)
         expect(calls).toBe(3)
      })

      it("can map to a different type", () => {
         expect(toList(map((x: number) => `${x}`)(from([1, 2, 3])))).toEqual(["1", "2", "3"])
      })
   })

   describe("flatMap", () => {
      it("flattens mapped sequences", () => {
         const result = toList(flatMap((x: number) => from([x, x * 2]))(from([1, 2, 3])))
         expect(result).toEqual([1, 2, 2, 4, 3, 6])
      })

      it("returns an empty sequence when the source is empty", () => {
         expect(toList(flatMap((x: number) => from([x, x]))(from([])))).toEqual([])
      })

      it("returns an empty sequence when all mapped sequences are empty", () => {
         expect(toList(flatMap((_: number) => from([]))(from([1, 2, 3])))).toEqual([])
      })

      it("is lazy — does not evaluate until consumed", () => {
         let calls = 0
         const seq = flatMap((x: number) => {
            calls++;
            return from([x])
         })(from([1, 2, 3]))
         expect(calls).toBe(0)
         toList(seq)
         expect(calls).toBe(3)
      })
   })

   describe("filter", () => {
      it("keeps elements matching the predicate", () => {
         expect(toList(filter((x: number) => x % 2 === 0)(from([1, 2, 3, 4, 5])))).toEqual([2, 4])
      })

      it("returns an empty sequence when no elements match", () => {
         expect(toList(filter((x: number) => x > 10)(from([1, 2, 3])))).toEqual([])
      })

      it("returns all elements when all match", () => {
         expect(toList(filter((x: number) => x > 0)(from([1, 2, 3])))).toEqual([1, 2, 3])
      })

      it("is lazy — does not evaluate until consumed", () => {
         let calls = 0
         const seq = filter((x: number) => {
            calls++;
            return x % 2 === 0
         })(from([1, 2, 3]))
         expect(calls).toBe(0)
         toList(seq)
         expect(calls).toBe(3)
      })
   })

   describe("reduce", () => {
      it("reduces the sequence to a single value", () => {
         expect(reduce((acc: number, x: number) => acc + x, 0)(from([1, 2, 3, 4]))).toBe(10)
      })

      it("returns the initial value for an empty sequence", () => {
         expect(reduce((acc: number, x: number) => acc + x, 0)(from([]))).toBe(0)
      })

      it("can reduce into a different type", () => {
         expect(reduce((acc: string, x: number) => `${acc}${x}`, "")(from([1, 2, 3]))).toBe("123")
      })

      it("evaluates eagerly", () => {
         let calls = 0
         reduce((acc: number, x: number) => {
            calls++;
            return acc + x
         }, 0)(from([1, 2, 3]))
         expect(calls).toBe(3)
      })
   })

   describe("take", () => {
      it("returns the first N elements", () => {
         expect(toList(take(3)(from([1, 2, 3, 4, 5])))).toEqual([1, 2, 3])
      })

      it("returns all elements when count exceeds length", () => {
         expect(toList(take(10)(from([1, 2, 3])))).toEqual([1, 2, 3])
      })

      it("returns an empty sequence when count is zero", () => {
         expect(toList(take(0)(from([1, 2, 3])))).toEqual([])
      })

      it("is lazy — only evaluates taken elements", () => {
         let calls = 0
         pipe(
            [1, 2, 3, 4, 5],
            from,
            take(2),
            tap(_ => calls += 1),
            collect
         )
         expect(calls).toBe(2)
      })
   })

   describe("skip", () => {
      it("skips the first N elements", () => {
         expect(toList(skip(2)(from([1, 2, 3, 4, 5])))).toEqual([3, 4, 5])
      })

      it("returns an empty sequence when count equals length", () => {
         expect(toList(skip(3)(from([1, 2, 3])))).toEqual([])
      })

      it("returns all elements when count is zero", () => {
         expect(toList(skip(0)(from([1, 2, 3])))).toEqual([1, 2, 3])
      })

      it("returns an empty sequence when count exceeds length", () => {
         expect(toList(skip(10)(from([1, 2, 3])))).toEqual([])
      })
   })

   describe("tap", () => {
      it("passes each element through unchanged", () => {
         expect(toList(tap((_: number) => {
         })(from([1, 2, 3])))).toEqual([1, 2, 3])
      })

      it("calls the side-effect function for each element", () => {
         const seen: number[] = []
         toList(tap((x: number) => seen.push(x))(from([1, 2, 3])))
         expect(seen).toEqual([1, 2, 3])
      })

      it("is lazy — does not call the side-effect until consumed", () => {
         let calls = 0
         const seq = tap((_: number) => calls++)(from([1, 2, 3]))
         expect(calls).toBe(0)
         toList(seq)
         expect(calls).toBe(3)
      })
   })

   describe("all", () => {
      it("returns true when every element satisfies the predicate", () => {
         expect(all((x: number) => x > 0)(from([1, 2, 3]))).toBe(true)
      })

      it("returns false when any element fails the predicate", () => {
         expect(all((x: number) => x > 0)(from([1, -1, 3]))).toBe(false)
      })

      it("returns false when the first element fails", () => {
         expect(all((x: number) => x > 0)(from([-1, 2, 3]))).toBe(false)
      })

      it("returns false when the last element fails", () => {
         expect(all((x: number) => x > 0)(from([1, 2, -1]))).toBe(false)
      })

      it("returns true for an empty sequence", () => {
         expect(all((x: number) => x > 0)(from([]))).toBe(true)
      })

      it("short-circuits on the first failing element", () => {
         let calls = 0
         all((x: number) => { calls++; return x > 0 })(from([-1, 2, 3]))
         expect(calls).toBe(1)
      })
   })

   describe("any", () => {
      it("returns true when any element satisfies the predicate", () => {
         expect(any((x: number) => x > 0)(from([-1, 2, -3]))).toBe(true)
      })

      it("returns false when no element satisfies the predicate", () => {
         expect(any((x: number) => x > 0)(from([-1, -2, -3]))).toBe(false)
      })

      it("returns true when the first element matches", () => {
         expect(any((x: number) => x > 0)(from([1, -2, -3]))).toBe(true)
      })

      it("returns true when only the last element matches", () => {
         expect(any((x: number) => x > 0)(from([-1, -2, 3]))).toBe(true)
      })

      it("returns false for an empty sequence", () => {
         expect(any((x: number) => x > 0)(from([]))).toBe(false)
      })

      it("short-circuits on the first matching element", () => {
         let calls = 0
         any((x: number) => { calls++; return x > 0 })(from([1, 2, 3]))
         expect(calls).toBe(1)
      })
   })

   describe("composition", () => {
      it("chains map and filter", () => {
         const evens = filter((x: number) => x % 2 === 0)
         const doubled = map((x: number) => x * 2)
         expect(
            toList(
               doubled(
                  evens(
                     from([1, 2, 3, 4, 5])
                  )
               )
            )
         ).toEqual([4, 8])
      })

      it("chains skip, take, and map", () => {
         const result = toList(
            map((x: number) => x * 10)(
               take(3)(
                  skip(2)(from([1, 2, 3, 4, 5, 6]))
               )
            )
         )
         expect(result).toEqual([30, 40, 50])
      })

      it("reduce after filter", () => {
         const sum = reduce((acc: number, x: number) => acc + x, 0)
         const odds = filter((x: number) => x % 2 !== 0)
         expect(sum(odds(from([1, 2, 3, 4, 5])))).toBe(9)
      })
   })

})
