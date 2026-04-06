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

/**
 * A function that takes a value an indicates whether it represents a `true` value in this context or not.
 */
type Predicate<T> = (value: T) => boolean

/**
 * The interface for objects that can be filtered
 */
export interface Filterable<T> {
   /**
    * Filters the value of this Filterable based on the supplied predicate
    */
   filter: (func: Predicate<T>) => this
}

/**
 * The folding function.
 * @param acc The accumulator value
 * @param value The current value
 */
type FolderFunc<T, U> = (acc: U, value: T) => U

/**
 * The interface for objects that are Foldable
 */
export interface Foldable<T> {
   /**
    * Folds the initial value into the supplied function and returns its result
    * @param func The folder function
    * @param initialValue The initial value to start the folding process off
    */
   fold: <U>(func: FolderFunc<T, U>, initialValue: U) => Foldable<U>
}

