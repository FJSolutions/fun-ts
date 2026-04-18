import type { None, Option, Some } from "./types";
import { isNullOrUndefined } from "../utils";

export const some = <T>(value: T): Option<T> => ({
   kind: "Option",
   type: "Some",
   value: value,
}) as Option<T>

export const none = <T>(): Option<T> => ({
   kind: "Option",
   type: "None",
})

export const isSome = <T>(option: Option<T>): option is Some<T> =>
   option.kind === "Option" && option.type === "Some" && !isNullOrUndefined(option.value);

export const isNone = (option: Option<unknown>): option is None =>
   option.kind === "Option" && option.type === "None";

export const from = <T>(value: T | null | undefined): Option<T> =>
   isNullOrUndefined(value) ? none() : some(value)

export const orElse = <T>(defaultValue: T) => (option: Option<T>): T =>
   isSome(option) ? option.value : defaultValue;

export const map = <T, U>(fn: (value: T) => U) => (option: Option<T>): Option<U> =>
   isSome(option) ? some(fn(option.value)) : none()

export const flatMap = <T, U>(fn: (value: T) => Option<U>) => (option: Option<T>): Option<U> =>
   isSome(option) ? fn(option.value) : none()

export const filter = <T>(predicate: (value: T) => boolean) => (option: Option<T>): Option<T> =>
   isSome(option) && predicate(option.value) ? option : none()

export const reduce = <T, R>(option: Option<T>, fn: (acc: R, value: T) => R, initial: R): R =>
   isSome(option) ? fn(initial, option.value) : initial

export const match = <T, U>(option: Option<T>, onSome: (value: T) => U, onNone: () => U): U =>
   isSome(option) ? onSome(option.value) : onNone()
