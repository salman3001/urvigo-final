import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { OrderStatus } from '#helpers/enums'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ServiceVariant from './serviceVariant.js'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare serviceVariantId: number

  @column()
  declare userId: number

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

  @belongsTo(() => ServiceVariant)
  declare serviceVariant: BelongsTo<typeof ServiceVariant>
}
