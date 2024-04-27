import vine from '@vinejs/vine'
import { DiscountType } from '../helpers/enums.js'

export const CreateServiceReviewValidator = vine.compile(
  vine.object({
    rating: vine.number().min(0).max(5),
    message: vine.string().maxLength(255).escape(),
  })
)

export const createServiceCategoryValidator = vine.compile(
  vine.object({
    image: vine
      .file({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '5mb',
      })
      .optional(),
    category: vine.object({
      id: vine.number().optional(),
      name: vine.string().unique(async (db, value) => {
        const category = await db.from('service_categories').where('name', value).first()
        return !category
      }),
      shortDesc: vine.string().optional(),
      longDesc: vine.string().optional(),
      status: vine.boolean().optional(),
    }),
    seo: vine
      .object({
        metaTitle: vine.string().optional(),
        metaKeywords: vine.string().optional(),
        metaDesc: vine.string().optional(),
      })
      .optional(),
    faq: vine
      .array(
        vine.object({
          quest: vine.string(),
          ans: vine.string(),
        })
      )
      .optional(),
  })
)

export const updateServiceCategoryValidator = vine
  .withMetaData<{
    serviceCategoryId: number
  }>()
  .compile(
    vine.object({
      image: vine
        .file({
          extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
          size: '5mb',
        })
        .optional(),
      category: vine.object({
        id: vine.number().optional(),
        name: vine
          .string()
          .unique(async (db, value, field) => {
            const category = await db
              .from('service_categories')
              .where('name', value)
              .andWhereNot('id', field.meta.serviceCategoryId)
              .first()
            return !category
          })
          .optional(),
        shortDesc: vine.string().optional(),
        longDesc: vine.string().optional(),
        status: vine.boolean().optional(),
      }),
      seo: vine
        .object({
          metaTitle: vine.string().optional(),
          metaKeywords: vine.string().optional(),
          metaDesc: vine.string().optional(),
        })
        .optional(),
      faq: vine
        .array(
          vine.object({
            quest: vine.string(),
            ans: vine.string(),
          })
        )
        .optional(),
    })
  )

export const createServiceValidator = vine.compile(
  vine.object({
    video: vine
      .file({
        extnames: ['mp4'],
        size: '25mb',
      })
      .optional(),
    images: vine
      .array(
        vine
          .file({
            extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
            size: '5mb',
          })
          .optional()
      )
      .optional(),
    variantImages: vine
      .array(
        vine
          .file({
            extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
            size: '5mb',
          })
          .optional()
      )
      .optional(),
    thumbnail: vine
      .file({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '5mb',
      })
      .optional(),
    service: vine.object({
      name: vine.string().unique(async (db, value) => {
        const service = await db.from('services').where('name', value).first()
        return !service
      }),
      shortDesc: vine.string().optional(),
      longDesc: vine.string().optional(),
      isActive: vine.boolean().optional(),
      locationSpecific: vine.boolean().optional(),
      geoLocation: vine.string().optional(),
      serviceCategoryId: vine.number().optional(),
      serviceSubcategoryId: vine.number().optional(),
    }),

    seo: vine
      .object({
        metaTitle: vine.string().optional(),
        metaKeywords: vine.string().optional(),
        metaDesc: vine.string().optional(),
      })
      .optional(),
    faq: vine
      .array(
        vine.object({
          quest: vine.string(),
          ans: vine.string(),
        })
      )
      .optional(),
    tags: vine.array(vine.number()).optional(),
    variant: vine.array(
      vine.object({
        name: vine.string().maxLength(100),
        price: vine.number(),
        discountType: vine.enum(Object.values(DiscountType)),
        discountFlat: vine.number().positive().optional(),
        discountPercentage: vine.number().positive().max(99).optional(),
        desc: vine.string().optional(),
      })
    ),
  })
)

export const updateServiceValidator = vine
  .withMetaData<{
    serviceId: number
  }>()
  .compile(
    vine.object({
      video: vine
        .file({
          extnames: ['mp4'],
          size: '25mb',
        })
        .optional(),
      images: vine
        .array(
          vine.file({
            extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
            size: '5mb',
          })
        )
        .optional(),
      variantImages: vine
        .array(
          vine.file({
            extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
            size: '5mb',
          })
        )
        .optional(),
      thumbnail: vine
        .file({
          extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
          size: '5mb',
        })
        .optional(),
      service: vine
        .object({
          name: vine
            .string()
            .unique(async (db, value, field) => {
              const service = await db
                .from('services')
                .where('name', value)
                .andWhereNot('id', field.meta.serviceId)
                .first()
              return !service
            })
            .optional(),
          shortDesc: vine.string().optional(),
          longDesc: vine.string().optional(),
          isActive: vine.boolean().optional(),
          locationSpecific: vine.boolean().optional(),
          geoLocation: vine.string().optional(),
          serviceCategoryId: vine.number().optional(),
          serviceSubcategoryId: vine.number().optional(),
        })
        .optional(),

      seo: vine
        .object({
          metaTitle: vine.string().optional(),
          metaKeywords: vine.string().optional(),
          metaDesc: vine.string().optional(),
        })
        .optional(),
      faq: vine
        .array(
          vine.object({
            quest: vine.string(),
            ans: vine.string(),
          })
        )
        .optional(),
      tags: vine.array(vine.number()).optional(),
      variant: vine
        .array(
          vine.object({
            name: vine.string().maxLength(100),
            price: vine.number(),
            discountType: vine.enum(Object.values(DiscountType)),
            discountFlat: vine.number().positive().optional(),
            discountPercentage: vine.number().positive().max(99).optional(),
            desc: vine.string().optional(),
          })
        )
        .optional(),
    })
  )
