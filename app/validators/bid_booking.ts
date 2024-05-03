import { PaymentMode } from '#helpers/enums'
import vine from '@vinejs/vine'

export const BidBookingCreateValidator = vine.compile(
  vine.object({
    serviceRequirementId: vine.number(),
    acceptedBidId: vine.number(),
    qty: vine.number().min(1),
    paymentdetail: vine.object({
      paymentMode: vine.enum(Object.values(PaymentMode)),
      paymentStatus: vine.enum(['pending', 'paid']),
    }),
    address: vine
      .object({
        geoLocation: vine.string(),
        mapAddress: vine.string(),
        address: vine.string().escape().optional(),
      })
      .optional(),
  })
)
