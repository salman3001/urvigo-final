import { OrderStatus } from '#helpers/enums'
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
    paymentdetail: vine.object({
      paymentMode: vine.enum(['cod', 'online']),
      paymentStatus: vine.enum(['pending', 'paid']),
    }),
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
