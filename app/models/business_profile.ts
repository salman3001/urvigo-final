import { BaseModel, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { ImageType } from '#helpers/types'
import Image from './image.js'
import Seo from './seo.js'
import Social from './social.js'
import Faq from './faq.js'
import User from './user.js'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Service from './service.js'
import Booking from './booking.js'
import BidBooking from './bid_booking.js'
import VendorReview from './vendor_review.js'

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

  @hasMany(() => Service)
  declare services: HasMany<typeof Service>

  @hasMany(() => Booking)
  declare booking: HasMany<typeof Booking>

  @hasMany(() => BidBooking)
  declare bidBooking: HasMany<typeof BidBooking>

  @hasMany(() => VendorReview)
  declare reviews: HasMany<typeof VendorReview>

  @belongsTo(() => User)
  declare vendor: BelongsTo<typeof User>
}
