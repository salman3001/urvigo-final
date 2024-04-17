import { DateTime } from 'luxon'
import { BaseModel, afterCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { BudgetType, NotificationTypes } from '#helpers/enums'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ServiceCategory from './serviceCategory.js'
import Bid from './bid.js'

export default class ServiceRequirement extends BaseModel {
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare desc: string

  @column({ prepare: (v) => JSON.stringify(v) })
  declare skillsRequired: string[]

  @column()
  declare budgetType: BudgetType

  @column()
  declare budget: string | number

  @column.dateTime()
  declare expiresAt: DateTime

  @column()
  declare location: string

  @column()
  declare userId: number

  @column()
  declare serviceCategoryId: number

  @column()
  declare acceptedBidId: number | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => ServiceCategory)
  declare serviceCategory: BelongsTo<typeof ServiceCategory>

  @hasMany(() => Bid)
  declare recievedBids: HasMany<typeof Bid>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterCreate()
  static async notifyUser(serviceRequirement: ServiceRequirement) {
    const categoryId = serviceRequirement.serviceCategoryId

    const users = await User.query().whereHas('subscribedCategories', (b) => {
      b.where('service_category_id', categoryId)
    })

    for (const user of users) {
      await user.related('notifications').create({
        data: {
          type: NotificationTypes.SERVICE_REQUIREMENT_ADDED,
          message: 'New Service Requirement Added',
          meta: {
            id: serviceRequirement.id,
            title: serviceRequirement.title,
          },
        },
      })
    }
  }
}
