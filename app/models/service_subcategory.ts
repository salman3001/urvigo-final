import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import ServiceCategory from './service_category.js'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import type { ImageType } from '#helpers/types'
import Service from './service.js'
import Faq from './faq.js'
import Seo from './seo.js'

export default class ServiceSubcategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare shortDesc: string

  @column()
  declare longDesc: string

  @column()
  declare status: boolean

  @column()
  declare serviceCategoryId: number

  @belongsTo(() => ServiceCategory)
  declare serviceCategory: BelongsTo<typeof ServiceCategory>

  @column()
  declare thumbnail: ImageType

  @hasMany(() => Service)
  declare services: HasMany<typeof Service>

  @hasMany(() => Faq)
  declare faqs: HasMany<typeof Faq>

  @hasOne(() => Seo)
  declare seo: HasOne<typeof Seo>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}


export type IServiceSubcategory = ServiceSubcategorys