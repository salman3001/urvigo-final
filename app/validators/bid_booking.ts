import { DeliveryOptions, PaymentMode, PaymentStatus } from '#helpers/enums'
import vine from '@vinejs/vine'

export const BidBookingCreateValidator = vine.compile(
  vine.object({
    serviceRequirementId: vine.number(),
    acceptedBidId: vine.number(),
    qty: vine.number().min(1),
    paymentdetail: vine.object({
      paymentMode: vine.enum(PaymentMode),
      paymentStatus: vine.enum(PaymentStatus),
    }),
    addressDetail: vine.object({
      geoLocation: vine.string(),
      mapAddress: vine.string(),
      address: vine.string().escape().optional(),
      mobile: vine.string().escape().minLength(8),
    }),
    deliveryType: vine.enum(DeliveryOptions),
    timeslot: vine
      .object({
        timeslotPlanId: vine.number(),
        from: vine.date({ formats: 'DD/MM/YYYY HH:mm' }),
        to: vine.date({ formats: 'DD/MM/YYYY HH:mm' }),
      })
      .optional(),
  })
)
