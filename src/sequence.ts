// The current implementations are synchronous and lazy; an asynchronous version could easily be created

// Creation/generation function(s).
// fromIterable
// fromGenerator (function)

/**
 * The interface of a sequence instance
 */
export interface Seq<T> extends Iterable<T> {
   toList: () => T[]
}

/**
 * Creates a sequence from an iterable.
 * @param source The iterable source to be converted into a sequence.
 */
export const of = <T>(source: Iterable<T>): Seq<T> => ({
   [Symbol.iterator]: source[Symbol.iterator],
   toList: () => toList(source),
})

/**
 * Folds the values of an iterable into a single value using a folder function.
 * @param folder A function that folds the next value into the accumulator.
 * @param accumulator The initial value of the accumulator
 * @returns The final value of the accumulator
 */
export const fold = <S, V>(folder: (acc: S, next: V) => S, accumulator: S) => {
   return (input: Iterable<V>): S => {
      if (typeof input[Symbol.iterator] !== "function") {
         throw new Error("The input to `fold` is not iterable");
      }

      for (const val of input) {
         accumulator = folder(accumulator, val as V);
      }

      return accumulator;
   };
};

/**
 * Maps each element of an iterable using a mapper function.
 * @param mapper A function that transforms each element.
 * @returns The same iterable with the elements transformed.
 */
export const map = <T, U>(mapper: (value: T) => U) => {
   return (input: Iterable<T>): Seq<U> => {
      if (typeof input[Symbol.iterator] !== "function") {
         throw new Error("The input to `map` is not iterable");
      }

      return of({
         [Symbol.iterator]: () => {
            const iterator = input[Symbol.iterator]();

            return {
               next: () => {
                  const result = iterator.next();

                  if (result.done) {
                     return result;
                  }

                  return {
                     value: mapper(result.value),
                     done: false,
                  };
               },
            };
         },
      });
   };
};

/**
 * Filters the elements of an iterable using a predicate function.
 * @param predicate A predicate function for filtering
 * @returns A new iterable with the elements that pass the predicate
 */
export const filter = <T>(predicate: (value: T) => boolean) => {
   return (input: Iterable<T>): Seq<T> => {
      if (typeof input[Symbol.iterator] !== "function") {
         throw new Error("The input to `filter` is not iterable");
      }

      return of({
         [Symbol.iterator]: () => {
            const iterator = input[Symbol.iterator]();

            return {
               next: () => {
                  let result = iterator.next();

                  while (!result.done && !predicate(result.value)) {
                     result = iterator.next();
                  }

                  return result;
               },
            };
         },
      });
   };
};

/**
 * Flattens and Maps over an iterable input
 * @param mapper The mapping function for each element
 */
export const flatMap = <T, U>(mapper: (value: T) => Iterable<U>) => {
   return (input: Iterable<T>): Seq<U> => {
      if (typeof input[Symbol.iterator] !== "function") {
         throw new Error("The input to `flatMap` is not iterable");
      }

      return of({
         [Symbol.iterator]: () => {
            const iterator = input[Symbol.iterator]();
            let currentIterator: Iterator<U> | null = null;

            return {
               next: () => {
                  if (currentIterator && !currentIterator.next().done) {
                     return currentIterator.next();
                  }

                  const result = iterator.next();

                  if (result.done) {
                     return result;
                  }

                  currentIterator = mapper(result.value)[Symbol.iterator]();

                  return currentIterator.next();
               },
            };
         },
      });
   };
};

/**
 * Realises the input sequence into a list array
 * @param input The sequence to realise into a list array
 * @returns An array of the values in the sequence
 */
export const toList = <T>(input: Iterable<T>): T[] => {
   if (typeof input[Symbol.iterator] !== "function") {
      throw new Error("The input to `toList` is not iterable");
   }

   const list: T[] = [];

   for (const val of input) {
      list.push(val);
   }

   return list;
};

/**
 * Takes the first `count` elements from the input sequence, or as many as the input sequence has elements.
 * @param count The number of elements to take
 * @param input The sequence to take elements from
 */
export const limit = <T>(count: number, input: Iterable<T>): Seq<T> => take(count)(input) as Seq<T>

/**
 * Takes the first `count` elements from the input sequence, or as many as the input sequence has elements.
 * @param count The maximum number of elements to tak
 */
export const take = <T>(count: number) => (input: Iterable<T>): Seq<T> => {
   if (typeof input[Symbol.iterator] !== "function") {
      throw new Error("The input to `take` is not iterable");
   }

   return of({
      [Symbol.iterator]: () => {
         const iterator = input[Symbol.iterator]();
         let index = 0;

         return {
            next: () => {
               if (index >= count) {
                  return {
                     done: true,
                     value: undefined,
                  } as IteratorResult<T, any>
               }

               const result = iterator.next();

               if (result.done) {
                  return result;
               }

               index += 1

               return {
                  value: result.value,
                  done: false,
               };
            },
         };
      },
   });
}

/**
 * Takes the first `count` elements from the input sequence, or as many as the input sequence has elements.
 * @param count The number of elements to skip
 * @param input The sequence to skip elements from
 */
export const offset = <T>(count: number, input: Iterable<T>): Seq<T> => skip(count)(input) as Seq<T>

/**
 * Skips the first `count` elements from the input sequence.
 * @param count The number of elements to skip.
 */
export const skip = <T>(count: number) => {
   return (input: Iterable<T>): Seq<T> => {
      if (typeof input[Symbol.iterator] !== "function") {
         throw new Error("The input to `skip` is not iterable")
      }

      return of({
         [Symbol.iterator]: () => {
            const iterator = input[Symbol.iterator]();
            let index = 0;

            return {
               next: () => {
                  while (true) {
                     const result = iterator.next();

                     if (result.done) {
                        return result;
                     }

                     if (index >= count) {
                        return result
                     } else {
                        index += 1
                     }
                  }
               },
            };
         },
      });
   }
}

/**
 * Pipes a sequence through a series of functions and returns a result.
 * @param seq The source `Iterable<T>` to start the pipe with
 * @param func1 A A function that takes a `Seq<A>` and returns a `Seq<B>`
 * @return A `Seq<B>`
 */
export const pipe = <A, B>(
   seq: Iterator<A>,
   func1: ((seq: Seq<A>) => Seq<B>)[]
): Seq<B> => {
   //! TODO: Implement the pipe function
   throw new Error("Not implemented!")
}