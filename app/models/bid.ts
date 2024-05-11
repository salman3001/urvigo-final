import { DateTime } from 'luxon'
import { BaseModel, afterCreate, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import ServiceRequirement from './service_requirement.js'
import { DeliveryOptions, NotificationTypes } from '#helpers/enums'
import BidFilter from './filters/bid_filter.js'
import { compose } from '@adonisjs/core/helpers'
import { Filterable } from 'adonis-lucid-filter'
import TimeslotPlan from './timeslot_plan.js'

export default class Bid extends compose(BaseModel, Filterable) {
  serializeExtras = true
  static $filter = () => BidFilter

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare offeredPrice: number | string

  @column()
  declare message: string

  @column({ prepare: (v) => JSON.stringify(v) })
  declare negotiateHistory: {
    date_time: DateTime
    asked_price: string
    message: string
    accepted: boolean
  }[]

  @column({ prepare: (v) => JSON.stringify(v) })
  declare deliveryOptions: Array<DeliveryOptions>

  @column()
  declare serviceRequirementId: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare vendor: BelongsTo<typeof User>

  @belongsTo(() => ServiceRequirement)
  declare serviceRequirement: BelongsTo<typeof ServiceRequirement>

  @hasOne(() => TimeslotPlan)
  declare timeSlotPlan: HasOne<typeof TimeslotPlan>

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
        title: 'New Bid recived',
        subTitle: 'You have Recived a New bid. click to checkout',
        meta: {
          requirement_id: bid.serviceRequirement.id,
        },
      },
    })
  }
}

export type IBid = Bid
