import vine from '@vinejs/vine'

export const conversationValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    participantId: vine.number(),
  })
)

export const messageValidator = vine.compile(
  vine.object({
    body: vine.string().maxLength(1500).escape(),
  })
)
