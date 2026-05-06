# `fun-ts` Discriminated Unions (DU)

This sub-package contains a functions for defining user-defined Sum-types. The 

Algebraic Data Types (ADTs) is the broadest term, from type theory. An algebraic type system has two fundamental
compositions: products and sums. So ADT covers both. A struct or tuple is a product type (it has this AND that). A
variant type is a sum type (it has this OR that). When people say "ADT" colloquially — including how we've been using
it — they usually mean sum types specifically, which is technically imprecise.

Sum types is the theoretically precise term for the OR composition. The name comes from the fact that the number of
possible values is the sum of the possibilities of each variant. An Option<bool> has three possible values: None, Some(
true), Some(false) — which is 1 + 2. Compare to a product type where possibilities are multiplied: a { a: bool, b:
bool } has 2 × 2 = 4 possible values.

Discriminated unions is the TypeScript/programming term for the same concept — a union type where each member carries a
literal tag field that lets the type system (and runtime) tell them apart. It's called "discriminated" because the tag
is the discriminant. It's the same idea as a sum type, just named from an implementation perspective rather than a
mathematical one.

So the hierarchy is:

- ADT = product types + sum types
- Sum type = the theoretical concept
- Discriminated union = a concrete implementation of a sum type

## Setup

Get the package:

```shell
pnpm add @judgeknot/fun-ts
```

Once installed Discriminated Unions can be created like the following:

```ts
export const PaymentError = makeDiscriminatedUnion({
    Declined: {} as { reason: string },
    InsufficientFunds: {} as { balance: number; required: number },
    CardExpired: {} as {},
})
```

In the above example:

- `PaymentError` is more like a module than an object; it contains the constructor and match functions for the DU
- `Declined`, `InsufficientFunds`, and `CardExpired` are a DU Variant specifications

The `PaymentError` can then be used to create variants:

```ts
const err: PaymentError = PaymentError.Declined({reason: "stolen card"})
```

And can be pattern matched (exhaustively):

```ts
const message = PaymentError.match(err, {
    Declined: ({reason}) => `Declined: ${reason}`,
    InsufficientFunds: ({balance, required}) => `Need ${required}, have ${balance}`,
    CardExpired: () => "Your card has expired",
})
```
