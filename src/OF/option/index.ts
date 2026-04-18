import { isNullOrUndefined } from "../../utils";
import type { Applicative, Filterable, Foldable, Functor, Kind, Kinds, Monad } from "../types";

type OptionType = "Some" | "None"

/**
 * The interface of an Option type
 */
// @ts-ignore
export interface Option<T> extends Kind, Monad<T>, Applicative<T>, Functor<T>, Filterable<T>, Foldable<T> {
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
    * Matches this Option's value with a matching function that returns a common type
    * @param some The function to run if the Option is a Some
    * @param nont The function to run if the Option is a None
    */
   match: <U>(some: (value: T) => U, none: () => U) => U
   /**
    * Filters the value of this Option based on the supplied predicate
    */
   filter: (func: (value: T) => boolean) => Option<T>
   /**
    * Folds the initial value into the supplied function and returns its result
    * @param func The folder function
    * @param initialValue The initial value to start the folding process off
    */
   fold: <U>(func: (acc: U, value: T) => U, initialValue: U) => Option<U>
}

/** @internal */
export class Maybe<T> implements Option<T> {
   protected readonly _value: T | undefined = undefined

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

   filter = (func: (value: T) => boolean): Option<T> => {
      if (this.isSome && !isNullOrUndefined(this._value) && func(this._value)) {
         return some(this._value)
      } else {
         return none()
      }
   }

   fold = <U>(func: (acc: U, value: T) => U, initialValue: U): Option<U> => {
      if (this.isSome && !isNullOrUndefined(this._value)) {
         const result = func(initialValue, this._value)
         return lift(result)
      } else {
         return none<U>()
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