import vine from '@vinejs/vine'

export const BidValidator = vine.compile(
  vine.object({
    serviceRequirementId: vine.number(),
    offeredPrice: vine.number().min(0),
    message: vine.string().maxLength(150).optional(),
    timeSlotPlanId: vine.number().optional(),
  })
)
