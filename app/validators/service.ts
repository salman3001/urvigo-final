import vine from '@vinejs/vine'

export const CreateServiceReviewValidator = vine.compile(
  vine.object({
    rating: vine.number().min(0).max(5),
    message: vine.string().maxLength(255).escape(),
  })
)
