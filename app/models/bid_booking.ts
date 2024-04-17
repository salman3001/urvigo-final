import { DateTime } from 'luxon'
import { BaseModel, afterCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { NotificationTypes, OrderStatus } from '#helpers/enums'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import BusinessProfile from './business_profile.js'

export default class BidBooking extends BaseModel {
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
  declare bookingDetail: {}

  @column({ prepare: (v) => JSON.stringify(v) })
  declare paymentDetail: {}

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
