import vine from '@vinejs/vine'

export const createBlogCategoryValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .unique(async (db, value) => {
        const category = await db.from('blog_categories').where('name', value).first()
        return !category
      }),
    slug: vine
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .unique(async (db, value) => {
        const category = await db.from('blog_categories').where('slug', value).first()
        return !category
      }),
    order: vine.number().optional(),
    status: vine.boolean().optional(),
    languageId: vine.number().optional(),
    metaTitle: vine.string().optional(),
    metaKeywords: vine.string().optional(),
    metaDesc: vine.string().optional(),
  })
)

export const updateBlogCategoryValidator = vine.withMetaData<{ categoryId: number }>().compile(
  vine.object({
    id: vine.number().optional(),
    name: vine
      .string()
      .trim()
      .unique(async (db, value, field) => {
        const category = await db
          .from('blog_categories')
          .where('name', value)
          .andWhereNot('id', field.meta.categoryId)
          .first()
        return !category
      })
      .optional(),
    slug: vine
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .unique(async (db, value, field) => {
        const category = await db
          .from('blog_categories')
          .where('slug', value)
          .andWhereNot('id', field.meta.categoryId)
          .first()
        return !category
      })
      .optional(),
    order: vine.number().optional(),
    status: vine.boolean().optional(),
    languageId: vine.number().optional(),
    metaTitle: vine.string().optional(),
    metaKeywords: vine.string().optional(),
    metaDesc: vine.string().optional(),
  })
)

export const createBlogValidator = vine.compile(
  vine.object({
    image: vine
      .file({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '5mb',
      })
      .optional(),
    title: vine.string().unique(async (db, value) => {
      const blog = await db.from('blogs').where('title', value).first()
      return !blog
    }),
    slug: vine
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .unique(async (db, value) => {
        const blog = await db.from('blogs').where('slug', value).first()
        return !blog
      })
      .optional(),
    isPublished: vine.boolean().optional(),
    blogCategoryId: vine.number().optional(),
    languageId: vine.number().optional(),
    shortDesc: vine.string().optional(),
    longDesc: vine.string().optional(),
    metaTitle: vine.string().optional(),
    metaKeywords: vine.string().optional(),
    metaDesc: vine.string().optional(),
  })
)

export const updateBlogValidator = vine.compile(
  vine.object({
    image: vine
      .file({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '5mb',
      })
      .optional(),
    title: vine
      .string()
      .unique(async (db, value) => {
        const blog = await db.from('blogs').where('title', value).first()
        return !blog
      })
      .optional(),
    slug: vine
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .unique(async (db, value) => {
        const blog = await db.from('blogs').where('slug', value).first()
        return !blog
      })
      .optional(),
    isPublished: vine.boolean().optional(),
    blogCategoryId: vine.number().optional(),
    languageId: vine.number().optional(),
    shortDesc: vine.string().optional(),
    longDesc: vine.string().optional(),
    metaTitle: vine.string().optional(),
    metaKeywords: vine.string().optional(),
    metaDesc: vine.string().optional(),
  })
)
