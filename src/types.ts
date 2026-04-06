export type Kinds = "Option" | "Result" | "Seq"

/**
 * Represents an interface that that identifies the Kind of Type instance
 */
export interface Kind {
   /**
    * This Type's Kind
    */
   readonly kind: Kinds
}

/**
 * Represents the interface of a Functor
 */
export interface Functor<T> {
   /**
    * Maps the value of Functor to another Functor
    */
   map: <U>(func: (value: T) => U) => Functor<U>
}

/**
 * Defines the interface of an applicative
 */
export interface Applicative<T> {
   /**
    * Applies a function wrapped in an Applicative to the value wrapped in this Applicative and returns it as a new value Applicative
    */
   apply: <U>(func: Applicative<(value: T) => U>) => Applicative<U>
}

/**
 * Defines the uniques interface of a Monad
 */
export interface Monad<T> {
   /**
    * Maps a value to another value in this Kind of Monad
    */
   flatMap: <U>(func: (value: T) => Monad<U>) => Monad<U>
}

