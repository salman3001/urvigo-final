import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Subscriber from './subscriber.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Campaign from './campaign.js'

export default class Interest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @manyToMany(() => Subscriber, {
    pivotTable: 'subscriber_interests_pivot',
  })
  declare subscribers: ManyToMany<typeof Subscriber>

  @manyToMany(() => Campaign, {
    pivotTable: 'campaign_interests_pivot',
  })
  declare campaigns: ManyToMany<typeof Campaign>
}
