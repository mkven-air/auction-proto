import type { Rules } from "@auction/core";
import { z } from "zod";

const ChannelsSchema = z
  .object({
    email: z.boolean(),
    mmb: z.boolean(),
    app: z.boolean(),
    web: z.boolean(),
    webcheckin: z.boolean(),
    pushNotif: z.boolean(),
  })
  .strict();

const PaymentMethodsSchema = z
  .object({
    visa: z.boolean(),
    mastercard: z.boolean(),
    amex: z.boolean(),
    jcb: z.boolean(),
    diners: z.boolean(),
  })
  .strict();

const nonNegInt = z.number().int().min(0);

/**
 * Runtime schema for `PUT /api/admin/rules` request body. Compile-time verified
 * against `Rules` from `@auction/core` via `satisfies`.
 */
export const RulesSchema = z
  .object({
    inviteDaysBefore: nonNegInt,
    chaserHoursBefore: nonNegInt,
    closureHoursBefore: nonNegInt,
    autoFulfillment: z.boolean(),
    requirePurchased: z.boolean(),
    blindBids: z.boolean(),
    maxUpgradesPerFlight: nonNegInt,
    multiplierPlatinum: z.number(),
    multiplierGold: z.number(),
    multiplierSilver: z.number(),
    minBcUltraShort: z.number(),
    minBcShort: z.number(),
    minBcMedium: z.number(),
    minBcLong: z.number(),
    minBcUltraLong: z.number(),
    minExitShort: z.number(),
    minExitMedium: z.number(),
    minExitLong: z.number(),
    minSeatBlockShort: z.number(),
    minSeatBlockMedium: z.number(),
    minSeatBlockLong: z.number(),
    channels: ChannelsSchema,
    paymentMethods: PaymentMethodsSchema,
    use3ds: z.boolean(),
    continuousPricing: z.boolean(),
    crossAirlineUpgrades: z.boolean(),
    payWithPoints: z.boolean(),
    seatBlocker: z.boolean(),
    onlyUpgrade: z.boolean(),
  })
  .strict() satisfies z.ZodType<Rules>;
