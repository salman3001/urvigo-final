import { DeliveryOptions, OrderStatus, PaymentMode, PaymentStatus } from '#helpers/enums'
import vine from '@vinejs/vine'

export const BookingSummaryValidator = vine.compile(
  vine.object({
    serviceVariantId: vine.number(),
    qty: vine.number().min(1),
    couponId: vine.number().optional(),
  })
)

export const CreateBookingValidator = vine.compile(
  vine.object({
    serviceVariantId: vine.number(),
    qty: vine.number().min(1),
    couponId: vine.number().optional(),
    paymentDetail: vine.object({
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
  })
)

export const UpdateBookingStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(Object.values(OrderStatus)),
    remarks: vine.string().maxLength(255).optional(),
  })
)

export const requestBookingCompletionValidator = vine.compile(
  vine.object({
    remarks: vine.string().maxLength(255).optional(),
  })
)
