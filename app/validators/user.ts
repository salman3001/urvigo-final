import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().maxLength(50).trim(),
    lastName: vine.string().maxLength(50).trim(),
    email: vine
      .string()
      .maxLength(255)
      .email()
      .normalizeEmail()
      .unique(async (db, value, field) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().maxLength(50).trim(),
    passwordConfirmation: vine.string().confirmed({
      confirmationField: 'password',
    }),
    phone: vine.string().optional(),
  })
)

/**
 * Validates the post's update action
 */
export const updateUserValidator = vine.withMetaData<{ userId: number }>().compile(
  vine.object({
    firstName: vine.string().maxLength(50).trim().optional(),
    lastName: vine.string().maxLength(50).trim().optional(),
    email: vine
      .string()
      .maxLength(255)
      .email()
      .normalizeEmail()
      .unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .whereNot('id', field.meta.userId)
          .where('email', value)
          .first()
        return !user
      })
      .optional(),
    phone: vine.string().optional(),
  })
)
