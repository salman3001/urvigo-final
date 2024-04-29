import vine from '@vinejs/vine'
import { DiscountType } from '../helpers/enums.js'
import { DateTime } from 'luxon'

export const couponIndexValidator = vine.compile(
  vine.object({
    serviceVariantId: vine.number(),
  })
)

export const createCouponValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50).escape(),
    desc: vine.string().maxLength(256).escape(),
    discountType: vine.enum(Object.values(DiscountType)),
    discountFlat: vine.number().min(0).optional(),
    discountPercentage: vine.number().min(0).max(99).optional(),
    maxUsers: vine.number(),
    minPurchaseAmount: vine.number().min(0),
    serviceIds: vine.array(vine.number()),
    validFrom: vine.date({ formats: 'DD/MM/YYYY HH:mm' }).after(() => {
      return DateTime.now().plus({ minute: 1 }).toFormat('dd/LL/yyyy HH:mm')
    }),
    expiredAt: vine.date({ formats: 'DD/MM/YYYY HH:mm' }).afterField('validFrom'),
  })
)

export const updateCouponValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50).escape().optional(),
    desc: vine.string().maxLength(256).escape().optional(),
    discountType: vine.enum(Object.values(DiscountType)).optional(),
    discountFlat: vine.number().min(0).optional().optional(),
    discountPercentage: vine.number().min(0).max(99).optional().optional(),
    maxUsers: vine.number().optional(),
    minPurchaseAmount: vine.number().min(0).optional(),
    serviceIds: vine.array(vine.number()).optional(),
    validFrom: vine.date({ formats: 'DD/MM/YYYY HH:mm' }).after(() => {
      return DateTime.now().plus({ minute: 1 }).toFormat('dd/LL/yyyy HH:mm')
    }),
    expiredAt: vine.date({ formats: 'DD/MM/YYYY HH:mm' }).afterField('validFrom'),
  })
)
