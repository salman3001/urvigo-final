import vine from '@vinejs/vine'

export const getOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
  })
)

export const varifyOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail().trim(),
    otp: vine.string(),
    password: vine.string().minLength(8).trim(),
    password_confirmation: vine.string().confirmed({ confirmationField: 'password' }).trim(),
  })
)

export const updatePasswordValidator = vine.compile(
  vine.object({
    password: vine.string().minLength(8).trim(),
    password_confirmation: vine.string().confirmed({ confirmationField: 'password' }),
    old_password: vine.string().trim(),
  })
)
