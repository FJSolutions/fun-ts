export { pipe } from "./pipe";
export { fold } from "./sequence";

/**
 * The `identity` function which returns its argument unchanged.
 * (Sometimes called `empty` or `zero`)
 * @param x The argument to return.
 * @returns The argument unchanged.
 */
export const id = <T>(x: T): T => x;
