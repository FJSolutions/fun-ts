import { isNullOrUndefined } from "../utils";
import type { Option, Result } from "./types";
import { some, none } from "./option";
import { success, failure } from "./result";

export const toIntOption = (input: string): Option<number> => {
   if (isNullOrUndefined(input))
      return none()

   try {
      const num = parseInt(input, 10)
      if (isNaN(num))
         return none()

      return some(num)
   } catch {
      return none()
   }
}

export const toFloatOption = (input: string): Option<number> => {
   if (isNullOrUndefined(input))
      return none()

   try {
      const num = parseFloat(input)
      if (isNaN(num))
         return none()

      return some(num)
   } catch {
      return none()
   }
}

export const toIntResult = (input: string): Result<number, Error> => {
   if (isNullOrUndefined(input))
      return failure("Input to Int Result is null or undefined", new Error("Input to Int Result is null or undefined"))

   try {
      const num = parseInt(input, 10)
      if (isNaN(num))
         return failure("Input to Int Result is Not a Number", new Error("Input to Int Result is Not a Number"))

      return success(num)
   } catch (ex) {
      const err = ex instanceof Error ? ex : new Error(String(ex))
      return failure(err.message, err)
   }
}

export const toFloatResult = (input: string): Result<number, Error> => {
   if (isNullOrUndefined(input))
      return failure("Input to Float Result is null or undefined", new Error("Input to Float Result is null or undefined"))

   try {
      const num = parseFloat(input)
      if (isNaN(num))
         return failure("Input to Float Result is Not a Number", new Error("Input to Float Result is Not a Number"))

      return success(num)
   } catch (ex) {
      const err = ex instanceof Error ? ex : new Error(String(ex))
      return failure(err.message, err)
   }
}
