import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Language extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string
}
