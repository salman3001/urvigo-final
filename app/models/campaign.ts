import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import CampaignType from './campaign_type.js'
import type { BelongsTo, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import Interest from './interest.js'
import Template from './template.js'

export default class Campaign extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare subject: string

  @column()
  declare fromName: string

  @column()
  declare fromEmail: string

  @column()
  declare replyTo: string

  @column()
  declare status: boolean

  @column.dateTime()
  declare deliveryDateTime: DateTime

  @column()
  declare campaignTypeId: number

  @belongsTo(() => CampaignType)
  declare campaignType: BelongsTo<typeof CampaignType>

  @manyToMany(() => Interest, {
    pivotTable: 'campaign_interests_pivot',
  })
  declare interests: ManyToMany<typeof Interest>

  @hasOne(() => Template)
  declare template: HasOne<typeof Template>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
