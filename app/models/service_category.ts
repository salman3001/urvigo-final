import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { ImageType } from '#helpers/types'
import ServiceSubcategory from './service_subcategory.js'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import Faq from './faq.js'
import Service from './service.js'
import Seo from './seo.js'
import User from './user.js'

export default class ServiceCategory extends BaseModel {
  serializeExtras = true

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
  declare thumbnail: ImageType

  @hasMany(() => ServiceSubcategory)
  declare subCategory: HasMany<typeof ServiceSubcategory>

  @hasMany(() => Faq)
  declare faqs: HasMany<typeof Faq>

  @hasMany(() => Service)
  declare services: HasMany<typeof Service>

  @hasOne(() => Seo)
  declare seo: HasOne<typeof Seo>

  @manyToMany(() => User, {
    pivotTable: 'vendor_subscribed_categories',
  })
  declare subscribedUsers: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

export type IServiceCategory = ServiceCategory
