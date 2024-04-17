import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import ConversationParticipant from './conversationParticipant.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Message from './message.js'

export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare participantOneId: number

  @column()
  declare participantTwoId: number

  @belongsTo(() => ConversationParticipant, {
    foreignKey: 'participantOneId',
  })
  declare participantOne: BelongsTo<typeof ConversationParticipant>

  @belongsTo(() => ConversationParticipant, {
    foreignKey: 'participantTwoId',
  })
  declare participantTwo: BelongsTo<typeof ConversationParticipant>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
