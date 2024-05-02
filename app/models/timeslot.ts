import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Booking from './booking.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import BidBooking from './bid_booking.js'

export default class Timeslot extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ consume: (v: string) => new Date(v) })
  declare startTime: Date

  @column({ consume: (v: string) => new Date(v) })
  declare endTime: Date

  @column()
  declare bookingId: number

  @column()
  declare bidBookingId: number

  @hasMany(() => Booking)
  declare bookings: HasMany<typeof Booking>

  @hasMany(() => BidBooking)
  declare bidBookings: HasMany<typeof BidBooking>
}

export type ITimeSlot = Timeslot
