import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Social extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare website: string

  @column()
  declare facebook: string

  @column()
  declare twitter: string

  @column()
  declare instagram: string

  @column()
  declare pintrest: string

  @column()
  declare linkedin: string

  @column()
  declare vk: string

  @column()
  declare whatsapp: string

  @column()
  declare telegram: string

  @column()
  declare userProfileId: number

  @column()
  declare businessProfileId: number
}
