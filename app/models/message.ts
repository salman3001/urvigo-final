import { DateTime } from 'luxon'
import { BaseModel, afterCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import Conversation from './conversation.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ws from '#services/ws'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare body: string

  @column()
  declare userId: number

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

  @afterCreate()
  static async pushNotification(message: Message) {
    await message.load('conversation')

    const room1 = 'chat-room-' + message.conversation.participantOneId
    const room2 = 'chat-room-' + message.conversation.participantTwoId

    if (ws.io) {
      if (room1 === room2) {
        ws.io.of('/chat/').to(room1).emit(`new-message`, message)
      } else {
        ws.io.of('/chat/').to(room1).emit(`new-message`, message)
        ws.io.of('/chat/').to(room2).emit(`new-message`, message)
      }
    }
  }
}

export type IMessage = Message