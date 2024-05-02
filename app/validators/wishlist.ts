import vine from '@vinejs/vine'

export const wishlistUpdateValidator = vine.compile(
  vine.object({
    serviceVariantIds: vine.array(vine.number()),
  })
)
