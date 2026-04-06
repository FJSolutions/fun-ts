
/**
 * The `identity` function which returns its argument unchanged.
 * (Sometimes called `empty` or `zero`)
 * @param x The value to return.
 * @returns The value unchanged.
 */
export const id = <T>(x: T): T => x;

/**
 * A function for creating lazy loaded values that are not computed until requested and are then cached.
 * @param func The creation function for the value
 */
export const lazy = <T>(func: () => T): { value: T } => {
   return new class {
      private _value: T | undefined

      get value(): T {
         if (this._value === undefined) {
            this._value = func()
         }
         return this._value
      }
   }
}