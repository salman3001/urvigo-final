import vine from '@vinejs/vine'

export const BidBookingCreateValidator = vine.compile(
  vine.object({
    serviceRequirementId: vine.number(),
    acceptedBidId: vine.number(),
    qty: vine.number().min(1),
    paymentdetail: vine.object({
      paymentMode: vine.enum(['cod', 'online']),
      paymentStatus: vine.enum(['pending', 'paid']),
    }),
  })
)
