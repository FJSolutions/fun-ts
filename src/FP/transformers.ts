import type { Option, Result, Seq } from "./types";
import * as O from "./option";
import * as R from "./result";
import * as S from "./sequence"

export const toResult = <T, E>(option: Option<T>, error: any): Result<T, E> => {
   if (O.isSome(option)) {
      return R.success(option.value)
   } else {
      if (error instanceof Error) {
         return R.failure(error.message, error) as Result<T, E>
      } else {
         return R.failure(error) as Result<T, E>
      }
   }
}

export const toOption = <T, E>(result: Result<T, E>): Option<T> =>
   R.isSuccess(result) ? O.some(result.value) : O.none()

/**
 * Sequences a sequence of Options into an Option of a sequence of a type
 * @param seq The sequence of Option instances
 */
export const sequence = <T>(seq: Seq<Option<T>>) => {
   const list = new Array<T>()
   for (const option of seq) {
      if (O.isSome(option))
         list.push(option.value)
      else
         return O.none() as Option<Seq<T>>
   }

   return O.some(list) as Option<Seq<T>>
}