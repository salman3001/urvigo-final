import { DeliveryOptions } from '#helpers/enums'
import vine from '@vinejs/vine'

export const createServiceRequirementValidator = vine.compile(
  vine.object({
    images: vine
      .array(
        vine.file({
          extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
          size: '5mb',
        })
      )
      .optional(),
    title: vine.string().maxLength(50).escape(),
    desc: vine.string().maxLength(1500).optional(),
    budgetUnit: vine.string().maxLength(50).escape(),
    budget: vine.number().min(1),
    keywords: vine.array(vine.string().maxLength(50).escape()).optional(),
    urgent: vine.boolean().optional(),
    expiresAt: vine.date({ formats: ['DD/MM/YYYY HH:mm'] }).after('today'),
    deliveryOptions: vine.array(vine.enum(DeliveryOptions)),
    geoLocation: vine.string(),
    address: vine.string().escape(),
    serviceCategoryId: vine.number(),
  })
)

export const updateServiceRequirementValidator = vine.compile(
  vine.object({
    images: vine
      .array(
        vine.file({
          extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
          size: '5mb',
        })
      )
      .optional(),
    title: vine.string().maxLength(50).escape().optional(),
    desc: vine.string().maxLength(1500).optional().optional(),
    budgetUnit: vine.string().maxLength(50).escape().optional(),
    budget: vine.number().min(1).optional(),
    keywords: vine.array(vine.string().maxLength(50).escape()).optional().optional(),
    urgent: vine.boolean().optional().optional(),
    expiresAt: vine.date({ formats: 'dd/MM/yyyy HH:mm' }).after('today').optional(),
    geoLocation: vine.string(),
    address: vine.string().escape(),
    serviceCategoryId: vine.number().optional(),
  })
)
