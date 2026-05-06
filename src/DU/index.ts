import type {DU, DUModule, Guards, VariantSpec, Matchers} from "./types";

/**
 * Creates a discriminated union module from a variant spec.
 *
 * Empty variants (no fields) become frozen constant objects.
 * Data variants become constructor functions.
 *
 * @example
 * const PaymentError = makeDiscriminatedUnion({
 *   Declined:          {} as { reason: string },
 *   InsufficientFunds: {} as { balance: number; required: number },
 *   CardExpired:       {} as {},
 * })
 *
 * type PaymentError = InferDU<typeof PaymentError>
 */
export function makeDiscriminatedUnion<Spec extends VariantSpec>(spec: Spec): DUModule<Spec> {
    const constructors = Object.fromEntries(
        Object.entries(spec).map(([tag, data]) => [
            tag,
            Object.keys(data).length === 0
                ? Object.freeze({_tag: tag})
                : (d: object) => ({_tag: tag, ...d}),
        ])
    )

    const match = <R>(instance: DU<Spec>, matchers: Matchers<Spec, R>): R =>
        (matchers as any)[instance._tag](instance)

    const is = Object.fromEntries(
        Object.keys(spec).map(tag => [
            tag,
            (instance: DU<Spec>) => instance._tag === tag,
        ])
    ) as Guards<Spec>

    return {...constructors, match, is} as DUModule<Spec>
}
