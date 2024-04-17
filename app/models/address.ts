import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare address: string

  @column()
  declare geoLocation: string

  @column()
  declare userProfileId: number

  @column()
  declare vendorProfileId: number
}
