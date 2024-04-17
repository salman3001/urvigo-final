import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Conversation from './conversation.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare body: string

  @column()
  declare userIdentifier: string

  @column()
  declare read: boolean

  @column()
  declare conversationId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Conversation)
  declare conversation: BelongsTo<typeof Conversation>

  // @afterCreate()
  // static async pushNotification(message: Message) {
  //   await message.load('conversation')

  //   const room1 = message.conversation.participantOneIdentifier + '-chats'
  //   const room2 = message.conversation.participantTwoIdentifier + '-chats'

  //   Ws.io.of('/chat/').to(room1).emit(`new-message`, message)
  //   Ws.io.of('/chat/').to(room2).emit(`new-message`, message)
  // }
}
