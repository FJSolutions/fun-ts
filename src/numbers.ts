import { isNullOrUndefined } from "./utils.ts";
import * as O from "./option";
import * as R from "./result";

/**
 * Safe parsing of a string to a decimal integer that returns an `Option` indicating if it was successful
 * @param input The string unput to parse as an integer
 */
export const toIntOption = (input: string): O.Option<number> => {
   if (isNullOrUndefined(input))
      return O.none()

   try {
      const num = parseInt(input, 10)
      if (isNaN(num))
         return O.none()

      return O.some(num)
   } catch {
      return O.none()
   }
}

/**
 * Safe parsing of a string to a floating point number that returns an `Option` indicating if it was successful
 * @param input The string unput to parse as a floating point number
 */
export const toFloatOption = (input: string): O.Option<number> => {
   if (isNullOrUndefined(input))
      return O.none()

   try {
      const num = parseFloat(input)
      if (isNaN(num))
         return O.none()

      return O.some(num)
   } catch {
      return O.none()
   }
}

/**
 * Safe parsing of a string to a decimal integer that returns a `Result` indicating if it was successful
 * @param input The string unput to parse as an integer
 */
export const toIntResult = (input: string): R.Result<number> => {
   if (isNullOrUndefined(input))
      return R.failure("Input to Int Result is null or undefined")

   try {
      const num = parseInt(input, 10)
      if (isNaN(num))
         return R.failure("Input to Int Result is Not a Number")

      return R.ok(num)
   } catch (ex) {
      if (ex instanceof Error)
         return R.failure(ex.message, ex)
      return R.failure(String(ex))
   }
}

/**
 * Safe parsing of a string to a floating point number that returns a `Result` indicating if it was successful
 * @param input The string unput to parse as a floating point number
 */
export const toFloatResult = (input: string): R.Result<number> => {
   if (isNullOrUndefined(input))
      return R.failure("Input to Int Result is null or undefined")

   try {
      const num = parseFloat(input)
      if (isNaN(num))
         return R.failure("Input to Int Result is Not a Number")

      return R.ok(num)
   } catch (ex) {
      if (ex instanceof Error)
         return R.failure(ex.message, ex)
      return R.failure(String(ex))
   }
}