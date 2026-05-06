/**
 * The type definition for the specification of DU variants
 */
export type VariantSpec = Record<string, object>

/**
 * A single tagged variant of a discriminated union.
 * Data fields are spread directly onto the object alongside `_tag`.
 *
 * @example
 * type Declined = Variant<"Declined", { reason: string }>
 * // { _tag: "Declined"; reason: string }
 */
export type Variant<Tag extends PropertyKey, Data extends object> =
    { readonly _tag: Tag } & Data

/**
 * The full discriminated union derived from a variant spec.
 * You will not typically write this yourself — use InferDU instead.
 */
export type DU<Spec extends VariantSpec> = {
    [K in keyof Spec]: Variant<K, Spec[K]>
}[keyof Spec]

/**
 * Empty data variants become frozen constants.
 * Data variants become constructor functions.
 */
type Constructors<Spec extends VariantSpec> = {
    [K in keyof Spec]: keyof Spec[K] extends never
        ? Variant<K, Spec[K]>
        : (data: Spec[K]) => Variant<K, Spec[K]>
}

/**
 * Exhaustive match — every variant must be handled.
 * TypeScript will error if any variant is missing.
 */
export type Matchers<Spec extends VariantSpec, R> = {
    [K in keyof Spec]: (data: Spec[K]) => R
}

/**
 * Type guards for narrowing — one per variant.
 */
export type Guards<Spec extends VariantSpec> = {
    [K in keyof Spec]: (instance: DU<Spec>) => instance is Variant<K, Spec[K]>
}

/**
 * The full module returned by makeDU.
 * Contains constructors, exhaustive match, and type guards.
 */
export type DUModule<Spec extends VariantSpec> =
    Constructors<Spec> & {
    match: <R>(instance: DU<Spec>, matchers: Matchers<Spec, R>) => R
    is: Guards<Spec>
}

/**
 * Derive the union type from a module without repeating the spec.
 *
 * @example
 * const PaymentError = makeDU({ ... })
 * type PaymentError = InferDU<typeof PaymentError>
 */
export type InferDU<T> = T extends DUModule<infer Spec> ? DU<Spec> : never
