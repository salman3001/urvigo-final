import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Skill extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare desc: string
}
