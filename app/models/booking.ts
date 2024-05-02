import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { OrderStatus } from '#helpers/enums'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ServiceVariant from './service_variant.js'
import BusinessProfile from './business_profile.js'
import type { IBookingDetail, PaymentDetail } from '../helpers/types.js'
import BookingFilter from './filters/booking_filter.js'
import { Filterable } from 'adonis-lucid-filter'
import { compose } from '@adonisjs/core/helpers'

export default class Booking extends compose(BaseModel, Filterable) {
  static $filter = () => BookingFilter
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare serviceVariantId: number

  @column()
  declare userId: number

  @column()
  declare businessProfileId: number

  @column({ prepare: (v) => JSON.stringify(v) })
  declare bookingDetail: IBookingDetail

  @column({ prepare: (v) => JSON.stringify(v) })
  declare paymentDetail: PaymentDetail

  @column({ prepare: (v) => JSON.stringify(v) })
  declare history: {
    date_time: DateTime | string
    event: string
    remarks: string
  }[]

  @column()
  declare status: OrderStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => BusinessProfile)
  declare businessProfile: BelongsTo<typeof BusinessProfile>

  @belongsTo(() => ServiceVariant)
  declare serviceVariant: BelongsTo<typeof ServiceVariant>
}

export type IBooking = Booking
