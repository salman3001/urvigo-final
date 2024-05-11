import { DateTime } from 'luxon'
import { BaseModel, afterCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { DeliveryOptions, NotificationTypes, OrderStatus } from '#helpers/enums'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import BusinessProfile from './business_profile.js'
import type { IbidBookingDetail, IbookingAddressDetail, PaymentDetail } from '#helpers/types'
import { compose } from '@adonisjs/core/helpers'
import { Filterable } from 'adonis-lucid-filter'
import BidBookingFilter from './filters/bid_booking_filter.js'
import BookedTimeslot from './booked_timeslot.js'
import Notification from './notification.js'

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

  @column()
  declare bookedTimeslotId: number

  @column({ prepare: (v) => JSON.stringify(v) })
  declare bookingDetail: IbidBookingDetail

  @column({ prepare: (v) => JSON.stringify(v) })
  declare paymentDetail: PaymentDetail

  @column({ prepare: (v) => JSON.stringify(v) })
  declare addressDetail: IbookingAddressDetail

  @column({ prepare: (v) => JSON.stringify(v) })
  declare history: {
    date_time: DateTime | string
    event: string
    remarks: string
  }[]

  @column()
  declare deliveryType: DeliveryOptions

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

  @belongsTo(() => BookedTimeslot)
  declare bookedTimeslot: BelongsTo<typeof BookedTimeslot>

  @afterCreate()
  static async pushNotification(bidBooking: BidBooking) {
    //notify user
    await Notification.create({
      userId: bidBooking.userId,
      data: {
        type: NotificationTypes.CUSTOM_BOOKING_CREATED,
        title: 'Booking Created',
        subTitle: 'You just created a new booking! Click to see detail',
        meta: {
          booking_id: bidBooking.id,
        },
      },
    })

    //notify vendor
    const businessProfile = await BusinessProfile.query()
      .where('id', bidBooking.businessProfileId)
      .first()
    if (businessProfile) {
      await Notification.create({
        userId: businessProfile.userId,
        data: {
          type: NotificationTypes.CUSTOM_BOOKING_RECIEVED,
          title: 'New Booking Recieved',
          subTitle: 'You just Recived a new booking! Click to see detail',
          meta: {
            booking_id: bidBooking.id,
          },
        },
      })
    }
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IBidBooking extends BidBooking {}
