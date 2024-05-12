import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Language from './language.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Blog from './blog.js'
import { compose } from '@adonisjs/core/helpers'
import { Filterable } from 'adonis-lucid-filter'
import BlogCategoryFilter from './filters/blog_category_filter.js'

export default class BlogCategory extends compose(BaseModel, Filterable) {
  static $filter = () => BlogCategoryFilter
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare order: number

  @column()
  declare status: boolean

  @column()
  declare languageId: number

  @belongsTo(() => Language)
  declare language: BelongsTo<typeof Language>

  @column()
  declare metaTitle: string

  @column()
  declare metaKeywords: string

  @column()
  declare metaDesc: string

  @hasMany(() => Blog)
  declare blogs: HasMany<typeof Blog>
}

export type IBlogCategory = BlogCategory
