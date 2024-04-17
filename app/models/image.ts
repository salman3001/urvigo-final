import type { ImageType } from '#helpers/types'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Image extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare file: ImageType

  @column()
  declare serviceId: number

  @column()
  declare businessProfileId: number
}
