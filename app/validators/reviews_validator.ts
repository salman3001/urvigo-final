import vine from '@vinejs/vine'
import { DiscountType } from '../helpers/enums.js'
import { numberLessThan } from '../../bin/validationRules.js'

export const CreateReviewValidator = vine.compile(
  vine.object({
    rating: vine.number().min(0).max(5),
    message: vine.string().maxLength(255).escape(),
  })
)
