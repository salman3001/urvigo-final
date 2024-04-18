import { BaseModel, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { ImageType } from '#helpers/types'
import Image from './image.js'
import Seo from './seo.js'
import Social from './social.js'
import Faq from './faq.js'
import Address from './address.js'
import User from './user.js'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Service from './service.js'
import Review from './review.js'

export default class BusinessProfile extends BaseModel {
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare businessName: string

  @column()
  declare avgRating: string

  @column()
  declare shortDesc: string

  @column()
  declare longDesc: string

  @column()
  declare isActive: boolean

  @column()
  declare avatar: ImageType

  @column()
  declare logo: ImageType

  @column()
  declare userId: number

  @hasMany(() => Image)
  declare images: HasMany<typeof Image>

  @hasOne(() => Seo)
  declare seo: HasOne<typeof Seo>

  @hasOne(() => Social)
  declare social: HasOne<typeof Social>

  @hasMany(() => Faq)
  declare faq: HasMany<typeof Faq>

  @hasMany(() => Address)
  declare addresses: HasMany<typeof Address>

  @hasMany(() => Service)
  declare services: HasMany<typeof Service>

  @hasMany(() => Review)
  declare reviews: HasMany<typeof Review>

  @belongsTo(() => User)
  declare vendor: BelongsTo<typeof User>
}
