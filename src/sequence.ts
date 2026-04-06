// NOTE: The current implementations are synchronous and lazy; an asynchronous version could also be created


import type { Filterable, Foldable, Functor, Kind, Kinds, Monad, Predicate } from "./types";
import { lazy } from "./general";

/**
 * The interface of a lazy sequence of items
 */
//@ts-ignore
export interface Seq<T> extends Kind, Iterable<T>, Functor<T>, Monad<T>, Filterable<T>, Foldable<T> {
   readonly kind: Kinds
   /**
    * Indicates whether this Result is a success or not
    */
   readonly isEmpty: boolean;
   /**
    * Returns this Sequence as a realised list
    */
   toList: () => T[]
   /**
    * Maps the value of Result to another Result
    */
   map: <U>(func: (value: T) => U) => Seq<U>
   /**
    * Maps a value to another value in this Kind of Result
    */
   flatMap: <U>(func: (value: T) => Seq<U>) => Seq<U>
   /**
    * Filters the value of this Option based on the supplied predicate
    */
   filter: (func: Predicate<T>) => Seq<T>
   /**
    * Folds the initial value into the supplied function and returns its result
    * @param func The folder function
    * @param initialValue The initial value to start the folding process off
    */
   fold: <U>(func: (acc: U, value: T) => U, initialValue: U) => U
   /**
    * Only takes a maximum number of items from the Sequence specified by Count
    * @param count The maximum number of items to take
    */
   take: (count: number) => Seq<T>
   /**
    * Returns a Sequence with the first items skipped
    * @param count The number of items to skip
    */
   skip: (count: number) => Seq<T>
   /**
    * Taps into the sequence to see each item as it passes, but performs no action on them
    */
   tap: (func: (value: T) => void) => Seq<T>
}


class Sequence<T> implements Seq<T> {
   constructor(
      readonly kind: Kinds,
      private readonly value: Iterable<T>) {
   }

   // [Symbol.iterator] = () => this.value[Symbol.iterator]()
   * [Symbol.iterator](): IterableIterator<T> {
      const it = this.value[Symbol.iterator]()

      while (true) {
         const {value, done} = it.next();
         if (done) break;
         yield value;
      }
   }

   get isEmpty(): boolean {
      return lazy(() => {
         const it = this.value[Symbol.iterator]()
         return !!it.next().done
      }).value
   }

   map = <U>(func: (value: T) => U): Seq<U> => {
      const source = this.value
      return from({
         * [Symbol.iterator]() {
            for (const item of source) yield func(item)
         }
      })
   }

   flatMap = <U>(func: (value: T) => Seq<U>): Seq<U> => {
      const source = this.value
      return from({
         * [Symbol.iterator]() {
            for (const item of source) yield* func(item)
         }
      })
   }

   filter = (func: Predicate<T>): Seq<T> => {
      const source = this.value
      return from({
         * [Symbol.iterator]() {
            for (const item of source) {
               if (func(item)) yield item
            }
         }
      })
   }

   fold = <U>(func: (acc: U, value: T) => U, initialValue: U): U => {
      let acc = initialValue
      for (const item of this) acc = func(acc, item)
      return acc
   }

   take = (count: number): Seq<T> => {
      const source = this.value
      return from({
         * [Symbol.iterator]() {
            let taken = 0
            for (const item of source) {
               if (taken >= count) break
               yield item
               taken++
            }
         }
      })
   }

   skip = (count: number): Seq<T> => {
      const source = this.value
      return from({
         * [Symbol.iterator]() {
            let skipped = 0
            for (const item of source) {
               if (skipped < count) {
                  skipped++;
                  continue
               }
               yield item
            }
         }
      })
   }

   tap = (func: (value: T) => void): Seq<T> => {
      const source = this.value
      return from({
         * [Symbol.iterator]() {
            for (const item of source) {
               func(item);
               yield item
            }
         }
      })
   }


   toList = (): T[] => Array.from(this.value)
}

/**
 * Creates a Sequence
 * @param source
 */
export const from = <T>(source: Iterable<T>): Seq<T> => new Sequence("Seq", source)
