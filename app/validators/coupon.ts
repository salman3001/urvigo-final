import vine from '@vinejs/vine'

export const couponIndexValidator = vine.compile(
  vine.object({
    serviceVariantId: vine.number(),
  })
)
