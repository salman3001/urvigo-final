import type { VideoType } from '#helpers/types'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare mediaId: number

  @column()
  declare file: VideoType

  @column()
  declare serviceId: number
}
