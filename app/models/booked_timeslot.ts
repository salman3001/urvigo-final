import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Booking from './booking.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import BidBooking from './bid_booking.js'
import TimeslotPlan from './timeslot_plan.js'

export default class BookedTimeslot extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ consume: (v: string) => new Date(v) })
  declare startTime: Date

  @column({ consume: (v: string) => new Date(v) })
  declare endTime: Date

  @column()
  declare timeslotPlanId: number

  @belongsTo(() => TimeslotPlan)
  declare timeslotPlan: BelongsTo<typeof TimeslotPlan>

  @hasMany(() => Booking)
  declare bookings: HasMany<typeof Booking>

  @hasMany(() => BidBooking)
  declare bidBookings: HasMany<typeof BidBooking>
}
