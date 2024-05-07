import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { ItimeslotPlanOptions } from '#helpers/types'
import BookedTimeslot from './booked_timeslot.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class TimeslotPlan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({ prepare: (v) => JSON.stringify(v) })
  declare options: ItimeslotPlanOptions

  @column()
  declare limitToOneBooking: boolean

  @column()
  declare serviceId: number

  @column()
  declare bidId: number

  @column()
  declare userId: number

  @hasMany(() => BookedTimeslot)
  declare bookedTimeslots: HasMany<typeof BookedTimeslot>
}

export type ITimeslotPlan = TimeslotPlan
