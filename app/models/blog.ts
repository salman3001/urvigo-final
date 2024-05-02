import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ImageType } from '#helpers/types'
import BlogCategory from './blog_category.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Language from './language.js'
import { compose } from '@adonisjs/core/helpers'
import { Filterable } from 'adonis-lucid-filter'
import BlogFilter from './filters/blog_filter.js'

export default class Blog extends compose(BaseModel, Filterable) {
  static $filer = () => BlogFilter

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare thumbnail: ImageType

  @manyToMany(() => BlogCategory, {
    pivotTable: 'blog_categories_pivot',
  })
  declare category: ManyToMany<typeof BlogCategory>

  @column()
  declare languageId: number

  @belongsTo(() => Language)
  declare language: BelongsTo<typeof Language>

  @column()
  declare shortDesc: string

  @column()
  declare longDesc: string

  @column()
  declare isPublished: boolean

  @column()
  declare metaTitle: string

  @column()
  declare metaKeywords: string

  @column()
  declare metaDesc: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

export type IBlog = Blog
