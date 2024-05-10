import vine from '@vinejs/vine'

export const CreateReviewValidator = vine.compile(
  vine.object({
    rating: vine.number().min(0).max(5),
    message: vine.string().maxLength(255).escape(),
  })
)

export const CreateVendorReviewValidator = vine.compile(
  vine.object({
    responseTime: vine.number().min(0).max(5),
    qualityOfService: vine.number().min(0).max(5),
    professionalBehavior: vine.number().min(0).max(5),
    communication: vine.number().min(0).max(5),
    fairPricing: vine.number().min(0).max(5),
    message: vine.string().maxLength(255).escape(),
  })
)
