import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import { CouponType, DiscountType } from '#helpers/enums'
import Service from './service.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import BusinessProfile from './business_profile.js'
import { compose } from '@adonisjs/core/helpers'
import { Filterable } from 'adonis-lucid-filter'
import CouponFilter from './filters/coupon_filter.js'

export default class Coupon extends compose(BaseModel, Filterable) {
  static $filter = () => CouponFilter
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

  @column({ consume: (v: string) => new Date(v) })
  declare expiredAt: Date

  @column({ consume: (v: string) => new Date(v) })
  declare validFrom: Date

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

export type ICoupon = Coupon