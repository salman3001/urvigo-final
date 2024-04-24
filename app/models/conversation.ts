import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Message from './message.js'
import { compose } from '@adonisjs/core/helpers'
import { Filterable } from 'adonis-lucid-filter'
import ConversationFilter from './filters/conversation_filter.js'
import User from './user.js'

export default class Conversation extends compose(BaseModel, Filterable) {
  static $filter = () => ConversationFilter

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare participantOneId: number

  @column()
  declare participantTwoId: number

  @belongsTo(() => User, {
    foreignKey: 'participantOneId',
  })
  declare participantOne: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'participantTwoId',
  })
  declare participantTwo: BelongsTo<typeof User>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
