import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Interest from './interest.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Subscriber extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column()
  declare phone: string

  @column()
  declare status: boolean

  @manyToMany(() => Interest, {
    pivotTable: 'subscriber_interests_pivot',
  })
  declare interests: ManyToMany<typeof Interest>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
