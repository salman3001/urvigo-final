import type { ImageType } from '#helpers/types'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Campaign from './campaign.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Template extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare desc: string

  @column()
  declare content: string

  @column()
  declare campaignId: number

  @column()
  declare thumbnail: ImageType

  @belongsTo(() => Campaign)
  declare campaign: BelongsTo<typeof Campaign>
}
