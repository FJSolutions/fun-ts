export type Some<T> = {
   kind: "Option"
   type: "Some"
   value: T
}

export type None = {
   kind: "Option"
   type: "None"
}

/**
 * A type that represents if some value is maybe there or none
 */
export type Option<T> = Some<T> | None

export type Success<T> = {
   kind: "Result"
   type: "Success"
   value: T
}

export type Failure<E> = {
   kind: "Result"
   type: "Failure"
   message: string
   error: E
}

/**
 * A type that represents either a successful result or a failure
 */
export type Result<T, E> = Success<T> | Failure<E>

/**
 * A lazily iterable sequence of values
 */
export type Seq<T> = Iterable<T>
