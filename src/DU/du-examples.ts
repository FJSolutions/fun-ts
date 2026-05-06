import {makeDiscriminatedUnion} from "./index";
import type {InferDU} from "./types";

/**
 * Define the PaymentError DU
 */
const PaymentError = makeDiscriminatedUnion({
    Declined: {} as { reason: string },
    InsufficientFunds: {} as { balance: number; required: number },
    CardExpired: {} as {},
})

/**
 * The `type` signature of the PaymentErrors DU
 */
type PaymentError = InferDU<typeof PaymentError>

// Instantiate a `Declined` PaymentError
const err: PaymentError = PaymentError.Declined({reason: "stolen card"})

// Match over PaymentErrors
const message = PaymentError.match(err, {
    Declined: ({reason}) => `Declined: ${reason}`,
    InsufficientFunds: ({balance, required}) => `Need ${required}, have ${balance}`,
    CardExpired: () => "Your card has expired",
})

console.log(message)

// Instantiate a `CardExpired` PaymentError.
// Because it has no data payload it is represented as a constant - no call needed.
const expired: PaymentError = PaymentError.CardExpired

// Match over PaymentErrors
const message2 = PaymentError.match(expired, {
    Declined: ({reason}) => `Declined: ${reason}`,
    InsufficientFunds: ({balance, required}) => `Need ${required}, have ${balance}`,
    CardExpired: () => "Your card has expired",
})

console.log(message2)

// Type guards for the PaymentError
if (PaymentError.is.Declined(err)) {
    // _err is narrowed to Variant<"Declined", { reason: string }>
    console.log(err.reason)
}

/**********************************
 *
 * --- Domain object Union/DU ---
 *
 **********************************/

/**
 * Define an OrderStatus DU
 */
const OrderStatus = makeDiscriminatedUnion({
    Pending: {} as {},
    Processing: {} as { startedAt: Date },
    Shipped: {} as { trackingNumber: string },
    Cancelled: {} as { reason: string },
})

/**
 * The public interface of the OrderStatus
 */
type OrderStatus = InferDU<typeof OrderStatus>

// A Shipped OrderStatus instance
const orderStatus: OrderStatus = OrderStatus.Shipped({trackingNumber: "TRK-001"})

// And example of exhaustive pattern matching the OrderStatus
const orderLabel = OrderStatus.match(orderStatus, {
    Pending: () => "Awaiting processing",
    Processing: ({startedAt}) => `Processing since ${startedAt.toISOString()}`,
    Shipped: ({trackingNumber}) => `Tracking: ${trackingNumber}`,
    Cancelled: ({reason}) => `Cancelled: ${reason}`,
})

console.log(orderLabel)