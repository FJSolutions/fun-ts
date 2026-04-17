import { isNullOrUndefined } from "../utils";
import { failure, success, type Result } from "../result";
import { Maybe } from "./index";

export interface Option<T> {
   /**
    * Returns the option as a Result, using the error message parameter for the Error if the value is None
    * @param errorMessage The error message to use if the Option is None
    */
   toResult: (errorMessage: string) => Result<T>
}

/** @internal */
class MaybeTransformer<T> extends Maybe<T> implements Option<T> {
   toResult = (errorMessage: string): Result<T> => {
      if (!isNullOrUndefined(this._value)) {
         return success(this._value)
      }
      return failure(errorMessage)
   }
}

export const some = <T>(value: T): Option<T> => new MaybeTransformer("Option", "Some", value)

export const none = <T>(): Option<T> => new MaybeTransformer("Option", "None")
