import { describe, expect, it } from "vitest";
import * as R from "../../src/result";
import { isNone, isSome } from "../../src/option";

describe("Result", () => {
   describe("ok", () => {
      it("should create an Ok result with the given value", () => {
         const result = R.success(42)
         expect(result.key).toBe("Success")
         expect(R.isSuccess(result)).toBeTruthy()
         expect(R.isFailure(result)).toBeFalsy()
      })

      it("should store the value", () => {
         const result = R.success("hello")
         expect(R.orElse("fallback")(result)).toBe("hello")
      })
   })

   describe("failure", () => {
      it("should create a Failure result with a message", () => {
         const result = R.failure("something went wrong")
         expect(result.key).toBe("Failure")
         expect(R.isSuccess(result)).toBeFalsy()
         expect(R.isFailure(result)).toBeTruthy()
      })

      it("should store the message", () => {
         const result = R.failure<number>("bad input")
         expect(R.isFailure(result) && result.message).toBe("bad input")
      })

      it("should store an optional Error when provided", () => {
         const err = new Error("underlying error")
         const result = R.failure<number>("bad input", err)
         expect(R.isFailure(result) && result.error).toBe(err)
      })

      it("should have no error when none is provided", () => {
         const result = R.failure<number>("no error")
         expect(R.isFailure(result) && result.error).toBeUndefined()
      })
   })

   describe("of", () => {
      it("should return Ok when the function succeeds", () => {
         const result = R.of(() => 10)
         expect(R.isSuccess(result)).toBeTruthy()
         expect(R.orElse(0)(result)).toBe(10)
      })

      it("should return Failure when the function throws an Error", () => {
         const result = R.of(() => {
            throw new Error("boom")
         })
         expect(R.isFailure(result)).toBeTruthy()
      })

      it("should capture the thrown Error in the failure", () => {
         const err = new Error("boom")
         const result = R.of(() => {
            throw err
         })
         expect(R.isFailure(result) && result.error).toBe(err)
      })

      it("should capture the error message in the failure", () => {
         const result = R.of(() => {
            throw new Error("boom")
         })
         expect(R.isFailure(result) && result.message).toBe("boom")
      })

      it("should handle thrown non-Error values", () => {
         const result = R.of(() => {
            throw "string error"
         })
         expect(R.isFailure(result)).toBeTruthy()
         expect(R.isFailure(result) && result.message).toBe("string error")
      })
   })

   describe("map", () => {
      it("should transform an Ok value", () => {
         const result = R.map((x: number) => x * 2)(R.success(5))
         expect(R.orElse(0)(result)).toBe(10)
      })

      it("should pass a Failure through unchanged", () => {
         const result = R.map((x: number) => x * 2)(R.failure("error"))
         expect(R.isFailure(result)).toBeTruthy()
         expect(R.isFailure(result) && result.message).toBe("error")
      })
   })

   describe("flatMap", () => {
      it("should apply a Result-returning function to an Ok value", () => {
         const result = R.flatMap((x: number) => R.success(x * 2))(R.success(5))
         expect(R.orElse(0)(result)).toBe(10)
      })

      it("should pass a Failure through unchanged", () => {
         const result = R.flatMap((x: number) => R.success(x * 2))(R.failure<number>("error"))
         expect(R.isFailure(result) && result.message).toBe("error")
      })

      it("should return Failure when the function returns Failure", () => {
         const result = R.flatMap((_x: number) => R.failure<number>("inner failure"))(R.success(5))
         expect(R.isFailure(result) && result.message).toBe("inner failure")
      })

      it("should chain multiple flatMaps", () => {
         const safeDivide = (divisor: number) => (x: number): R.Result<number> =>
            divisor === 0 ? R.failure("division by zero") : R.success(x / divisor)

         const result = R.pipe(
            R.success(100),
            R.flatMap(safeDivide(4)),
            R.flatMap(safeDivide(5)),
         )
         expect(R.orElse(0)(result)).toBe(5)
      })

      it("should short-circuit on the first Failure in a chain", () => {
         const safeDivide = (divisor: number) => (x: number): R.Result<number> =>
            divisor === 0 ? R.failure("division by zero") : R.success(x / divisor)

         const result = R.pipe(
            R.success(100),
            R.flatMap(safeDivide(0)),
            R.flatMap(safeDivide(5)),
         )
         expect(R.isFailure(result) && result.message).toBe("division by zero")
      })
   })

   describe("filter", () => {
      it("should keep an Ok that satisfies the predicate", () => {
         const result = R.filter((x: number) => x > 0, "must be positive")(R.success(5))
         expect(R.isSuccess(result)).toBeTruthy()
      })

      it("should turn an Ok into Failure when predicate fails", () => {
         const result = R.filter((x: number) => x > 0, "must be positive")(R.success(-1))
         expect(R.isFailure(result)).toBeTruthy()
         expect(R.isFailure(result) && result.message).toBe("must be positive")
      })

      it("should pass a Failure through unchanged", () => {
         const result = R.filter((x: number) => x > 0, "must be positive")(R.failure<number>("original error"))
         expect(R.isFailure(result) && result.message).toBe("original error")
      })
   })

   describe("fold", () => {
      it("should call onOk with the value for an Ok result", () => {
         const result = R.fold(
            (msg) => `error: ${msg}`,
            (value: number) => `value: ${value}`,
         )(R.success(7))
         expect(result).toBe("value: 7")
      })

      it("should call onFailure with the message for a Failure result", () => {
         const result = R.fold(
            (msg) => `error: ${msg}`,
            (value: number) => `value: ${value}`,
         )(R.failure<number>("went wrong"))
         expect(result).toBe("error: went wrong")
      })

      it("should pass the optional error to onFailure", () => {
         const err = new Error("underlying")
         const result = R.fold(
            (_msg, error) => error?.message ?? "no error",
            (_value: number) => "ok",
         )(R.failure<number>("went wrong", err))
         expect(result).toBe("underlying")
      })
   })

   describe("match", () => {
      it("should call the ok handler with the value for an Ok result", () => {
         const result = R.match(
            (value: number) => `value: ${value}`,
            (msg) => `error: ${msg}`,
         )(R.success(7))
         expect(result).toBe("value: 7")
      })

      it("should call the failure handler with the message for a Failure result", () => {
         const result = R.match(
            (value: number) => `value: ${value}`,
            (msg) => `error: ${msg}`,
         )(R.failure<number>("went wrong"))
         expect(result).toBe("error: went wrong")
      })

      it("should pass the optional error to the failure handler", () => {
         const err = new Error("underlying")
         const result = R.match(
            (_value: number) => "ok",
            (_msg, error) => error?.message ?? "no error",
         )(R.failure<number>("went wrong", err))
         expect(result).toBe("underlying")
      })

      it("should support returning different types from each branch", () => {
         const toLength = R.match(
            (value: string) => value.length,
            () => -1,
         )
         expect(toLength(R.success("hello"))).toBe(5)
         expect(toLength(R.failure("error"))).toBe(-1)
      })
   })

   describe("orElse", () => {
      it("should return the Ok value", () => {
         expect(R.orElse(99)(R.success(1))).toBe(1)
      })

      it("should return the default value for a Failure", () => {
         expect(R.orElse(99)(R.failure("error"))).toBe(99)
      })
   })

   describe("lift", () => {
      it("should apply a function to an Ok value", () => {
         const result = R.lift((x: number) => x + 1)(R.success(4))
         expect(R.orElse(0)(result)).toBe(5)
      })

      it("should pass a Failure through unchanged", () => {
         const result = R.lift((x: number) => x + 1)(R.failure<number>("error"))
         expect(R.isFailure(result) && result.message).toBe("error")
      })

      it("should return Failure when the lifted function throws", () => {
         const result = R.lift((_x: number) => {
            throw new Error("lift error")
         })(R.success(1))
         expect(R.isFailure(result)).toBeTruthy()
         expect(R.isFailure(result) && result.message).toBe("lift error")
      })
   })

   describe("pipe", () => {
      it("should pipe an Ok through a single function", () => {
         const result = R.pipe(
            R.success(2),
            R.map((x: number) => x * 3),
         )
         expect(R.orElse(0)(result)).toBe(6)
      })

      it("should pipe an Ok through multiple functions", () => {
         const result = R.pipe(
            R.success(2),
            R.map((x: number) => x + 1),
            R.map((x: number) => x * 10),
            R.filter((x: number) => x > 0, "must be positive"),
         )
         expect(R.orElse(0)(result)).toBe(30)
      })

      it("should short-circuit on Failure and not apply subsequent maps", () => {
         let sideEffect = false
         const result = R.pipe(
            R.success(-1),
            R.filter((x: number) => x > 0, "must be positive"),
            R.map((x: number): number => {
               sideEffect = true;
               return x * 10
            }),
         )
         expect(R.isFailure(result)).toBeTruthy()
         expect(sideEffect).toBeFalsy()
      })

      it("should propagate a Failure from the initial value", () => {
         const result = R.pipe(
            R.failure<number>("initial failure"),
            R.map((x: number) => x * 2),
         )
         expect(R.isFailure(result) && result.message).toBe("initial failure")
      })
   })

   describe("Result transformers", () => {
      it("should convert an OK to a Some", () => {
         const source = R.success(1)
         const result = source.toOption()
         expect(isSome(result)).toBeTruthy()
      })

      it("should convert a Failure to a None", () => {
         const source = R.failure("Not a number")
         const result = source.toOption()
         expect(isNone(result)).toBeTruthy()
      })
   })
})