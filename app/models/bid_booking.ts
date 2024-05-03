import { DateTime } from 'luxon'
import { BaseModel, afterCreate, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import { NotificationTypes, OrderStatus } from '#helpers/enums'
import User from './user.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import BusinessProfile from './business_profile.js'
import type { IbidBookingDetail, PaymentDetail } from '#helpers/types'
import { compose } from '@adonisjs/core/helpers'
import { Filterable } from 'adonis-lucid-filter'
import BidBookingFilter from './filters/bid_booking_filter.js'
import Timeslot from './timeslot.js'
import Address from './address.js'

export default class BidBooking extends compose(BaseModel, Filterable) {
  static $filter = () => BidBookingFilter
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare qty: number

  @column()
  declare price: string | number

  @column()
  declare userId: number

  @column()
  declare businessProfileId: number

  @column({ prepare: (v) => JSON.stringify(v) })
  declare bookingDetail: IbidBookingDetail

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

  @hasOne(() => Timeslot)
  declare timeSlot: HasOne<typeof Timeslot>

  @hasOne(() => Address)
  declare address: HasOne<typeof Address>

  @afterCreate()
  static async notifyUser(booking: BidBooking) {
    await booking.load('user')

    booking.user.related('notifications').create({
      data: {
        type: NotificationTypes.BOOKING_CREATED,
        message: 'You Service has booked Successfully',
        meta: {
          bookingId: booking.id,
        },
      },
    })
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IBidBooking extends BidBooking {}
