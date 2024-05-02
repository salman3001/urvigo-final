import vine from '@vinejs/vine'
import { WeekDays } from '../helpers/enums.js'

export const CreateTimeslotValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(100).escape(),
    limitToOneBooking: vine.boolean(),
    options: vine.array(
      vine.object({
        week: vine.enum(WeekDays),
        from: vine.string(),
        to: vine.string(),
      })
    ),
  })
)

export const UpdateTimeslotValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(100).escape(),
    limitToOneBooking: vine.boolean(),
    options: vine.array(
      vine.object({
        week: vine.enum(WeekDays),
        from: vine.string(),
        to: vine.string(),
      })
    ),
  })
)
