import { DateTime } from 'luxon'
import {
  BaseModel,
  afterCreate,
  belongsTo,
  column,
  hasMany,
  hasOne,
  manyToMany,
} from '@adonisjs/lucid/orm'
import { NotificationTypes } from '#helpers/enums'
import User from './user.js'
import type { BelongsTo, HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import ServiceCategory from './service_category.js'
import Bid from './bid.js'
import Image from './image.js'
import ServiceTag from './service_tag.js'
import ServiceRequirementFilter from './filters/service_requirement_filter.js'
import { compose } from '@adonisjs/core/helpers'
import { Filterable } from 'adonis-lucid-filter'
import TimeslotPlan from './timeslot_plan.js'

export default class ServiceRequirement extends compose(BaseModel, Filterable) {
  serializeExtras = true
  static $filter = () => ServiceRequirementFilter

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare desc: string

  @column()
  declare budgetType: string

  @column()
  declare budget: string | number

  @column()
  declare budgetUnit: string

  @column({ consume: (v: string) => new Date(v) })
  declare expiresAt: Date

  @column()
  declare location: string

  @column()
  declare urgent: boolean

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

  @hasMany(() => Image)
  declare images: HasMany<typeof Image>

  @manyToMany(() => ServiceTag, {
    pivotTable: 'service_requirement_tags_pivot',
  })
  declare tags: ManyToMany<typeof ServiceTag>

  @hasOne(() => TimeslotPlan)
  declare timeSlotPlan: HasOne<typeof TimeslotPlan>

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

export type IServiceRequirement = ServiceRequirement
