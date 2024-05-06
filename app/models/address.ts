import { AddressType } from '#helpers/enums'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: AddressType

  @column()
  declare mapAddress: string

  @column()
  declare address: string

  @column()
  declare mobile: string

  @column()
  declare geoLocation: string

  @column()
  declare userProfileId: number
}

export type IAddress = Address
