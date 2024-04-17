import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import { CouponType, DiscountType } from '#helpers/enums'
import Service from './service.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import BusinessProfile from './business_profile.js'

export default class Coupon extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare desc: string

  @column()
  declare couponType: CouponType

  @column()
  declare discountType: DiscountType

  @column()
  declare discountFlat: number

  @column()
  declare discountPercentage: number

  @column()
  declare maxUsers: number

  @column()
  declare minPurchaseAmount: number

  @column.dateTime({ autoCreate: true })
  declare expiredAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare validFrom: DateTime

  @column()
  declare businessProfileId: number

  @belongsTo(() => BusinessProfile)
  declare businessProfile: BelongsTo<typeof BusinessProfile>

  @manyToMany(() => Service, { pivotTable: 'service_coupons' })
  declare services: ManyToMany<typeof Service>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
