import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { ItimeslotPlanOptions } from '#helpers/types'

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
}

export type ITimeslotPlan = TimeslotPlan
