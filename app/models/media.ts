import { DateTime } from 'luxon'
import { BaseModel, hasOne, column } from '@adonisjs/lucid/orm'
import Image from './image.js'
import Video from './video.js'
import type { MediaTypes } from '#helpers/enums'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class Media extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare type: MediaTypes

  @hasOne(() => Image)
  declare image: HasOne<typeof Image>

  @hasOne(() => Video)
  declare video: HasOne<typeof Video>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
