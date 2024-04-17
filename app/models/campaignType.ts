import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Campaign from './campaign.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'


export default class CampaignType extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(() => Campaign)
  declare campaign: HasMany<typeof Campaign>
}
