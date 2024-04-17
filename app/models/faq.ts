import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Faq extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare quest: string

  @column()
  declare ans: string

  @column()
  declare serviceSubcategoryId: number

  @column()
  declare serviceCategoryId: number

  @column()
  declare serviceId: number

  @column()
  declare serviceTagId: number

  @column()
  declare businessProfileId: number
}
