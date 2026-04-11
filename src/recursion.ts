/**
 * An interface defining configuration option for the recursion
 */
export interface RecursionConfiguration {
   /**
    * The depth of the recursion, or the maximum number of times the processor will be called (default = 1000)
    */
   depth: number;
}

/**
 * An interface that defines the state of the recursion when an error was thrown
 */
export interface RecursionState<T, R> {
   /**
    * The actual depth of the recursion when the error happened
    */
   depth: number
   /**
    * The state of the accumulator
    */
   acc: R
   /**
    * The state of the source
    */
   source: T
}

/**
 * A custom error that can be thrown during recursion
 */
class RecursionError<T, R> extends Error {
   readonly state: RecursionState<T, R>;

   constructor(message: string, state: RecursionState<T, R>) {
      super(message);
      this.name = "StateError";
      this.state = state;
   }
}

/**
 * A function that recurses the supplied processor function until the condition is met and the returns a final result
 * @param source The source value that is being recursed over
 * @param accumulator The initial value that is threaded through the processor function, accumulating a value
 * @param processor The function that recursively processes the source into the accumulator
 * @param predicate A function that defines when the recursion should continue
 * @param config An optional configuration instance
 */
export const recurse = <T, R>(
   source: T,
   accumulator: R,
   predicate: (value: T) => boolean,
   processor: (input: T, acc: R) => [T, R],
   config?: Partial<RecursionConfiguration>
): R => {
   const cfg: RecursionConfiguration = {
      ...{depth: 100} as RecursionConfiguration,
      ...config
   }
   let acc = accumulator
   let inp = source
   let i = 0

   for (; i < cfg.depth; i += 1) {
      if (predicate(inp)) {
         let [inp2, acc2] = processor(inp, acc);
         inp = inp2
         acc = acc2
      } else {
         return acc
      }
   }

   if (i >= cfg.depth) {
      throw new RecursionError("Exceeded the maximum recursion depth", {acc, depth: i, source})
   }

   return acc;
}
