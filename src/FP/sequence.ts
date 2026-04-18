import type { Seq } from "./types";

export const from = <T>(source: Iterable<T>): Seq<T> => ({
   * [Symbol.iterator](): IterableIterator<T> {
      for (const item of source) yield item
   }
})

export const toList = <T>(seq: Seq<T>): T[] => Array.from(seq)

/**
 * Forces iteration of the Seq without returning a value
 * @param seq The sequence to iterate
 */
export const collect = <T>(seq: Seq<T>): void => {
   const it = seq[Symbol.iterator]()
   while (!it.next().done) {
   }
}

/**
 * Indicates whether the iterator is empty or not
 * @param seq The sequence to check
 */
export const isEmpty = <T>(seq: Seq<T>): boolean =>
   seq[Symbol.iterator]().next().done === true

export const map = <T, U>(fn: (value: T) => U) => (seq: Seq<T>): Seq<U> => ({
   * [Symbol.iterator]() {
      for (const item of seq) yield fn(item)
   }
})

export const flatMap = <T, U>(fn: (value: T) => Seq<U>) => (seq: Seq<T>): Seq<U> => ({
   * [Symbol.iterator]() {
      for (const item of seq) yield* fn(item)
   }
})

export const filter = <T>(predicate: (value: T) => boolean) => (seq: Seq<T>): Seq<T> => ({
   * [Symbol.iterator]() {
      for (const item of seq) {
         if (predicate(item)) yield item
      }
   }
})

export const reduce = <T, U>(fn: (acc: U, value: T) => U, initial: U) => (seq: Seq<T>): U => {
   let acc = initial
   for (const item of seq) acc = fn(acc, item)
   return acc
}

export const take = (count: number) => <T>(seq: Seq<T>): Seq<T> => ({
   * [Symbol.iterator]() {
      let taken = 0
      for (const item of seq) {
         if (taken >= count) break
         yield item
         taken++
      }
   }
})

export const skip = (count: number) => <T>(seq: Seq<T>): Seq<T> => ({
   * [Symbol.iterator]() {
      let skipped = 0
      for (const item of seq) {
         if (skipped < count) {
            skipped++;
            continue
         }
         yield item
      }
   }
})

export const tap = <T>(fn: (value: T) => void) => (seq: Seq<T>): Seq<T> => ({
   * [Symbol.iterator]() {
      for (const item of seq) {
         fn(item)
         yield item
      }
   }
})

/**
 * Returns true when all the items in the Seq pass the predicate
 * @param predicate The function to test each item with
 */
export const all = <T>(predicate: (value: T) => boolean) => (seq: Seq<T>): boolean => {
   for (const item of seq) {
      if (!predicate(item)) return false
   }
   return true
}

/**
 * Returns true if any of the items in the sequence pass the predicate
 * @param predicate The function to test the items in the Seq against
 */
export const any = <T>(predicate: (value: T) => boolean) => (seq: Seq<T>): boolean => {
   for (const item of seq) {
      if (predicate(item)) return true
   }
   return false
}
