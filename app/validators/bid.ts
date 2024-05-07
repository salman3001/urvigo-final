import { DeliveryOptions } from '#helpers/enums'
import vine from '@vinejs/vine'

export const BidValidator = vine.compile(
  vine.object({
    serviceRequirementId: vine.number(),
    offeredPrice: vine.number().min(0),
    message: vine.string().maxLength(150).optional(),
    deliveryOptions: vine.array(vine.enum(DeliveryOptions)),
    timeSlotPlanId: vine.number().optional(),
  })
)
