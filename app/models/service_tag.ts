import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { ImageType } from '#helpers/types'
import Faq from './faq.js'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Seo from './seo.js'

export default class ServiceTag extends BaseModel {
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

  @hasMany(() => Faq)
  declare faqs: HasMany<typeof Faq>

  @hasOne(() => Seo)
  declare seo: HasOne<typeof Seo>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

export type IServiceTag = ServiceTag
