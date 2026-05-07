import { isNullOrUndefined } from "../utils";
import * as O from "./option";
import * as R from "./result";

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

export const toIntResult = (input: string): R.Result<number> => {
   if (isNullOrUndefined(input))
      return R.failure("Input to Int Result is null or undefined")

   try {
      const num = parseInt(input, 10)
      if (isNaN(num))
         return R.failure("Input to Int Result is Not a Number")

      return R.success(num)
   } catch (ex) {
      if (ex instanceof Error)
         return R.failure(ex.message, ex)
      return R.failure(String(ex))
   }
}

export const toFloatResult = (input: string): R.Result<number> => {
   if (isNullOrUndefined(input))
      return R.failure("Input to Float Result is null or undefined")

   try {
      const num = parseFloat(input)
      if (isNaN(num))
         return R.failure("Input to Float Result is Not a Number")

      return R.success(num)
   } catch (ex) {
      if (ex instanceof Error)
         return R.failure(ex.message, ex)
      return R.failure(String(ex))
   }
}
