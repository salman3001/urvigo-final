import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare mapAddress: string

  @column()
  declare address: string

  @column()
  declare geoLocation: string

  @column()
  declare userProfileId: number

  @column()
  declare serviceId: number

  @column()
  declare serviceRequirementId: number

  @column()
  declare bookingId: number

  @column()
  declare bidBookingId: number
}

export type IAddress = Address
