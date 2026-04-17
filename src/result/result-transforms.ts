import { isNullOrUndefined } from "../utils";
import { none, some, type Option } from "../option";
import { Either } from "./index";

/**
 * Defines the interface of a transformable Result
 */
export interface Result<T> {
   /**
    * Transforms this Result into an Option
    */
   toOption: () => Option<T>
}

/** @internal */
class EitherTransformer<T> extends Either<T> implements Result<T> {
   toOption = (): Option<T> => {
      if (!isNullOrUndefined(this._value)) {
         return some(this._value)
      }
      return none<T>()
   }
}

export const success = <T>(value: T): Result<T> =>
   new EitherTransformer<T>("Result", "Success", value)

export const failure = <T>(errorMessage: string, error?: Error): Result<T> =>
   new EitherTransformer<T>("Result", "Failure", undefined, errorMessage, error)
