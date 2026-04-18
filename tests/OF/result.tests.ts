import { describe, expect, it } from "vitest";
import { failure, lift, success } from "../../src/OF/result";

describe("Result", () => {

   describe("success", () => {
      it("should have kind 'Result'", () => {
         expect(success(42).kind).toBe("Result")
      })

      it("should have tag 'Success'", () => {
         expect(success(42).tag).toBe("Success")
      })

      it("should be a success", () => {
         expect(success(42).isSuccess).toBeTruthy()
      })

      it("should not be a failure", () => {
         expect(success(42).isFailure).toBeFalsy()
      })

      it("should return the value from orElse", () => {
         expect(success(42).orElse(-1)).toBe(42)
      })

      it("should work with a string value", () => {
         const r = success("hello")
         expect(r.isSuccess).toBeTruthy()
         expect(r.orElse("default")).toBe("hello")
      })

      it("should work with an object value", () => {
         const obj = { name: "alice" }
         const r = success(obj)
         expect(r.orElse({ name: "unknown" })).toEqual({ name: "alice" })
      })
   })

   describe("failure", () => {
      it("should have kind 'Result'", () => {
         expect(failure("oops").kind).toBe("Result")
      })

      it("should have tag 'Failure'", () => {
         expect(failure("oops").tag).toBe("Failure")
      })

      it("should not be a success", () => {
         expect(failure("oops").isSuccess).toBeFalsy()
      })

      it("should be a failure", () => {
         expect(failure("oops").isFailure).toBeTruthy()
      })

      it("should return the default value from orElse", () => {
         expect(failure<number>("oops").orElse(-1)).toBe(-1)
      })

      it("should accept an optional Error", () => {
         const error = new Error("something went wrong")
         const r = failure<number>("oops", error)
         expect(r.isFailure).toBeTruthy()
         expect(r.orElse(-1)).toBe(-1)
      })
   })

   describe("lift", () => {
      it("should return a success when the thunk does not throw", () => {
         const r = lift(() => 42)
         expect(r.isSuccess).toBeTruthy()
         expect(r.orElse(-1)).toBe(42)
      })

      it("should return a failure when the thunk throws an Error", () => {
         const r = lift<number>(() => { throw new Error("boom") })
         expect(r.isFailure).toBeTruthy()
         expect(r.orElse(-1)).toBe(-1)
      })

      it("should return a failure when the thunk throws a non-Error value", () => {
         const r = lift<number>(() => { throw "string error" })
         expect(r.isFailure).toBeTruthy()
      })

      it("should capture a successful computed value", () => {
         const r = lift(() => JSON.parse('{"x":10}') as { x: number })
         expect(r.isSuccess).toBeTruthy()
      })

      it("should fail on a JSON parse error", () => {
         const r = lift(() => JSON.parse("not json"))
         expect(r.isFailure).toBeTruthy()
      })
   })

   describe("map", () => {
      it("should transform the value of a success", () => {
         const r = success(21).map(x => x * 2)
         expect(r.isSuccess).toBeTruthy()
         expect(r.orElse(-1)).toBe(42)
      })

      it("should leave a failure unchanged", () => {
         const r = failure<number>("oops").map(x => x * 2)
         expect(r.isFailure).toBeTruthy()
         expect(r.orElse(-1)).toBe(-1)
      })

      it("should chain multiple maps on a success", () => {
         const r = success(10)
            .map(x => x + 5)
            .map(x => x * 2)
            .orElse(-1)
         expect(r).toBe(30)
      })

      it("should short-circuit maps after a failure", () => {
         const r = failure<number>("oops")
            .map(x => x + 5)
            .map(x => x * 2)
            .orElse(-1)
         expect(r).toBe(-1)
      })
   })

   describe("match", () => {
      it("should call the success branch on a success", () => {
         const r = success(42).match(
            value => `ok:${value}`,
            () => "fail"
         )
         expect(r).toBe("ok:42")
      })

      it("should call the failure branch on a failure", () => {
         const r = failure<number>("something went wrong").match(
            value => `ok:${value}`,
            errorMessage => `fail:${errorMessage}`
         )
         expect(r).toBe("fail:something went wrong")
      })

      it("should pass the Error to the failure branch when provided", () => {
         const error = new Error("root cause")
         const r = failure<number>("oops", error).match(
            () => null,
            (_msg, err) => err
         )
         expect(r).toBe(error)
      })

      it("should return undefined Error in the failure branch when none provided", () => {
         const r = failure<number>("oops").match(
            () => null,
            (_msg, err) => err
         )
         expect(r).toBeUndefined()
      })

      it("should return a common type from both branches", () => {
         const toLabel = (result: ReturnType<typeof success<number>>) =>
            result.match(
               value => value > 0 ? "positive" : "zero or negative",
               () => "unknown"
            )
         expect(toLabel(success(10))).toBe("positive")
         expect(toLabel(success(-1))).toBe("zero or negative")
      })
   })

   describe("filter", () => {
      it("should return the success unchanged when the predicate passes", () => {
         const r = success(42).filter(x => x > 0)
         expect(r.isSuccess).toBeTruthy()
         expect(r.orElse(-1)).toBe(42)
      })

      it("should return a failure when the predicate fails", () => {
         const r = success(42).filter(x => x < 0)
         expect(r.isFailure).toBeTruthy()
         expect(r.orElse(-1)).toBe(-1)
      })

      it("should return a failure unchanged when filtering a failure", () => {
         const r = failure<number>("oops").filter(x => x > 0)
         expect(r.isFailure).toBeTruthy()
         expect(r.orElse(-1)).toBe(-1)
      })

      it("should chain with map after a passing filter", () => {
         const r = success(21)
            .filter(x => x > 0)
            .map(x => x * 2)
            .orElse(-1)
         expect(r).toBe(42)
      })

      it("should short-circuit map after a failing filter", () => {
         const r = success(21)
            .filter(x => x > 100)
            .map(x => x * 2)
            .orElse(-1)
         expect(r).toBe(-1)
      })
   })

   describe("fold", () => {
      it("should apply the folder function to the value of a success", () => {
         const r = success(42).fold((acc, x) => acc + x, 0)
         expect(r.isSuccess).toBeTruthy()
         expect(r.orElse(-1)).toBe(42)
      })

      it("should use the initial value as the accumulator", () => {
         const r = success(10).fold((acc, x) => acc + x, 5)
         expect(r.orElse(-1)).toBe(15)
      })

      it("should return a failure when folding a failure", () => {
         const r = failure<number>("oops").fold((acc, x) => acc + x, 0)
         expect(r.isFailure).toBeTruthy()
         expect(r.orElse(-1)).toBe(-1)
      })

      it("should fold into a different type", () => {
         const r = success(42).fold((acc, x) => `${acc}${x}`, "value:")
         expect(r.isSuccess).toBeTruthy()
         expect(r.orElse("none")).toBe("value:42")
      })
   })

   describe("flatMap", () => {
      it("should bind a success to another success", () => {
         const r = success(21).flatMap(x => success(x * 2))
         expect(r.isSuccess).toBeTruthy()
         expect(r.orElse(-1)).toBe(42)
      })

      it("should bind a success to a failure", () => {
         const r = success(42).flatMap(_ => failure<number>("inner failure"))
         expect(r.isFailure).toBeTruthy()
         expect(r.orElse(-1)).toBe(-1)
      })

      it("should leave a failure unchanged when flatMapping", () => {
         const r = failure<number>("oops").flatMap(x => success(x * 2))
         expect(r.isFailure).toBeTruthy()
         expect(r.orElse(-1)).toBe(-1)
      })

      it("should chain flatMaps", () => {
         const r = success(10)
            .flatMap(x => success(x + 5))
            .flatMap(x => success(x * 2))
            .orElse(-1)
         expect(r).toBe(30)
      })

      it("should short-circuit flatMaps after a failure", () => {
         const r = success(10)
            .flatMap(_ => failure<number>("stopped here"))
            .flatMap(x => success(x * 2))
            .orElse(-1)
         expect(r).toBe(-1)
      })
   })
})
