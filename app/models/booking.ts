import { DateTime } from 'luxon'
import { BaseModel, afterCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { DeliveryOptions, NotificationTypes, OrderStatus } from '#helpers/enums'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ServiceVariant from './service_variant.js'
import BusinessProfile from './business_profile.js'
import type { IBookingDetail, IbookingAddressDetail, PaymentDetail } from '../helpers/types.js'
import BookingFilter from './filters/booking_filter.js'
import { Filterable } from 'adonis-lucid-filter'
import { compose } from '@adonisjs/core/helpers'
import BookedTimeslot from './booked_timeslot.js'
import Notification from './notification.js'

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

  @column()
  declare bookedTimeslotId: number

  @column({ prepare: (v) => JSON.stringify(v) })
  declare bookingDetail: IBookingDetail

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

  @belongsTo(() => ServiceVariant)
  declare serviceVariant: BelongsTo<typeof ServiceVariant>

  @belongsTo(() => BookedTimeslot)
  declare bookedTimeslot: BelongsTo<typeof BookedTimeslot>

  @afterCreate()
  static async pushNotification(booking: Booking) {
    //notify user
    await Notification.create({
      userId: booking.userId,
      data: {
        type: NotificationTypes.BOOKING_CREATED,
        title: 'Booking Created',
        subTitle: 'You just created a new booking! Click to see detail',
        meta: {
          booking_id: booking.id,
        },
      },
    })

    //notify vendor
    const businessProfile = await BusinessProfile.query()
      .where('id', booking.businessProfileId)
      .first()
    if (businessProfile) {
      await Notification.create({
        userId: businessProfile.userId,
        data: {
          type: NotificationTypes.BOOKING_RECIEVED,
          title: 'New Booking Recieved',
          subTitle: 'You just Recived a new booking! Click to see detail',
          meta: {
            booking_id: booking.id,
          },
        },
      })
    }
  }
}

export type IBooking = Booking
