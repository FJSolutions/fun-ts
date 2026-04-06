import { isNullOrUndefined } from "./utils";
import { failure, success, type Result } from "./result";
import type { Applicative, Functor, Kind, Kinds, Match, Monad } from "./types";


type OptionType = "Some" | "None"

/**
 * The interface of an Option type
 */
// @ts-ignore
export interface Option<T> extends Kind, Monad<T>, Applicative<T>, Functor<T>, Match<T> {
   readonly kind: Kinds;
   /**
    * A key to identify what kind of option this is
    */
   readonly tag: OptionType
   /**
    * Checks the Option and returns true if it is some
    */
   readonly isSome: boolean
   /**
    * Checks the Option and returns true if it is none
    */
   readonly isNone: boolean
   /**
    * The default value to return if the Option is none
    */
   orElse: (defaultValue: T) => T
   /**
    * Maps the value of an Option to another value if there is some
    */
   map: <U>(func: (value: T) => U) => Option<U>
   /**
    * Applies a function wrapped in an Option to a value wrapped in an Option and returns it as a new value Option
    */
   apply: <U>(func: Option<(value: T) => U>) => Option<U>
   /**
    * Maps the value of an Option to another value if there is some and returns the result
    */
   // It is the return type of the function parameter that is causing the ts-error!
   flatMap: <U>(func: (value: T) => Option<U>) => Option<U>
   /**
    * Returns the option as a Result, using the error message parameter for the Error if the value is None
    * @param errorMessage The error message to use if the Option is None
    */
   toResult: (errorMessage: string) => Result<T>
}

class Maybe<T> implements Option<T> {
   private readonly _value: T | undefined = undefined

   constructor(
      public readonly kind: Kinds,
      public readonly tag: OptionType,
      value?: T
   ) {
      this._value = value
   }

   get isSome(): boolean {
      return this.tag === "Some"
   }

   get isNone(): boolean {
      return this.tag === "None"
   }

   get tap(): T | undefined {
      return this._value
   }

   orElse = (defaultValue: T): T => this.isSome ? this._value! : defaultValue;

   map = <U>(func: (value: T) => U): Option<U> => {
      if (this.isSome) {
         const result = func(this._value!)
         if (!isNullOrUndefined(result)) {
            return some(result)
         }
      }

      return none()
   }

   flatMap = <U>(func: (value: T) => Option<U>): Option<U> => {
      if (this.isSome) {
         return func(this._value!)
      }
      return none<U>()
   }


   match = <U>(some: (value: T) => U, none: () => U): U => {
      if (this.isSome) {
         return some(this._value!)
      } else {
         return none()
      }
   }

   apply = <U>(func: Option<(value: T) => U>): Option<U> => {
      if (func.isSome && this.isSome) {
         const f = (func as Maybe<(value: T) => U>).tap!
         const result = f(this._value!)
         return lift<U>(result)
      }
      return none<U>()
   }

   toResult = (errorMessage: string): Result<T> => {
      if (!isNullOrUndefined(this._value)) {
         return success(this._value)
      } else {
         return failure(errorMessage)
      }
   }
}

/**
 * Lists a value into an Option
 * @param value The value to lift into an Option
 */
export const lift = <T>(value: T): Option<T> => isNullOrUndefined(value) ? none() : some(value)

/**
 * Creates a Some Option from a non-nullable or undefined value
 * @param value The non-null/undefined value to put in the Option
 */
export const some = <T>(value: T): Option<T> => new Maybe("Option", "Some", value)

/**
 * Creates a None Option that represents the absence of a value
 */
export const none = <T>(): Option<T> => new Maybe("Option", "None")
