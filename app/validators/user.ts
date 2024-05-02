import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    avatar: vine
      .file({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '5mb',
      })
      .optional(),
    logo: vine
      .file({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '5mb',
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
    firstName: vine.string().maxLength(50).trim(),
    lastName: vine.string().maxLength(50).trim(),
    email: vine
      .string()
      .maxLength(255)
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
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

export const createVendorValidator = vine.compile(
  vine.object({
    avatar: vine
      .file({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '5mb',
      })
      .optional(),
    logo: vine
      .file({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '5mb',
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
    firstName: vine.string().maxLength(50).trim(),
    lastName: vine.string().maxLength(50).trim(),
    email: vine
      .string()
      .maxLength(255)
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().maxLength(50).trim(),
    passwordConfirmation: vine.string().confirmed({
      confirmationField: 'password',
    }),
    phone: vine.string().optional(),
    businessProfile: vine.object({
      businessName: vine
        .string()
        .maxLength(100)
        .unique(async (db, value) => {
          const businessProfile = await db
            .from('business_profiles')
            .where('business_name', value)
            .first()
          return !businessProfile
        }),
    }),
  })
)

export const vendorFromExistingUserValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().trim(),
    businessProfile: vine.object({
      businessName: vine
        .string()
        .maxLength(100)
        .unique(async (db, value) => {
          const businessProfile = await db
            .from('business_profiles')
            .where('business_name', value)
            .first()
          return !businessProfile
        }),
    }),
  })
)

export const updateUserValidator = vine
  .withMetaData<{ userId: number; businessProfileId: number }>()
  .compile(
    vine.object({
      avatar: vine
        .file({
          extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
          size: '5mb',
        })
        .optional(),
      logo: vine
        .file({
          extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
          size: '5mb',
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
      businessProfile: vine
        .object({
          businessName: vine
            .string()
            .maxLength(100)
            .unique(async (db, value, field) => {
              const businessProfileQuery = db
                .query()
                .from('business_profiles')
                .where('business_name', value)

              if (field.meta.businessProfileId) {
                businessProfileQuery.whereNot('id', field.meta.businessProfileId)
              }
              const businessProfile = await businessProfileQuery.first()
              return !businessProfile
            })
            .optional(),
        })
        .optional(),
    })
  )
