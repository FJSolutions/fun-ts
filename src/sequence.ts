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
 * Transforms each element of an iterable using a mapper function.
 * @param mapper A function that transforms each element.
 * @returns The same iterable with the elements transformed.
 */
export const map = <T, U>(mapper: (value: T) => U) => {
   return (input: Iterable<T>): Iterable<U> => {
      if (typeof input[Symbol.iterator] !== "function") {
         throw new Error("The input to `map` is not iterable");
      }

      return {
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
      };
   };
};

/**
 *
 * @param predicate A predicate function for filtering
 * @returns
 */
export const filter = <T>(predicate: (value: T) => boolean) => {
   return (input: Iterable<T>): Iterable<T> => {
      if (typeof input[Symbol.iterator] !== "function") {
         throw new Error("The input to `filter` is not iterable");
      }

      return {
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
      };
   };
};

export const flatMap = <T, U>(mapper: (value: T) => Iterable<U>) => {
   return (input: Iterable<T>): Iterable<U> => {
      if (typeof input[Symbol.iterator] !== "function") {
         throw new Error("The input to `flatMap` is not iterable");
      }

      return {
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
      };
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
