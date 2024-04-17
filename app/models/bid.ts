import { DateTime } from 'luxon'
import { BaseModel, afterCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ServiceRequirement from './serviceRequirement.js'
import { NotificationTypes } from '#helpers/enums'

export default class Bid extends BaseModel {
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare offeredPrice: number | string

  @column()
  declare message: string

  @column()
  declare serviceRequirementId: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => ServiceRequirement)
  declare serviceRequirement: BelongsTo<typeof ServiceRequirement>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterCreate()
  static async notifyUser(bid: Bid) {
    await bid.load('serviceRequirement', (s) => {
      s.preload('user')
    })

    await bid.serviceRequirement.user.related('notifications').create({
      data: {
        type: NotificationTypes.BID_RECIEVED,
        message: 'Some one added a bid on your service requirement',
        meta: {
          serviceRequirementId: bid.serviceRequirement.id,
        },
      },
    })
  }
}
