export { pipe } from "./pipe";
export * from "./sequence";
export * from "./option"

/**
 * The `identity` function which returns its argument unchanged.
 * (Sometimes called `empty` or `zero`)
 * @param x The value to return.
 * @returns The value unchanged.
 */
export const id = <T>(x: T): T => x;
