import { DateTime } from 'luxon'
import { column, BaseModel, afterCreate } from '@adonisjs/lucid/orm'
import ws from '#services/ws'
import type { NotificationData } from '#helpers/types'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare data: NotificationData

  @column()
  declare userId: number

  async markAsRead() {
    this.readAt = DateTime.now()
    await this.save()
  }

  async markAsUnread() {
    this.readAt = null
    await this.save()
  }

  @column.dateTime()
  declare readAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterCreate()
  static async pushNotification(notification: Notification) {
    let room = ''
    room = `notification-room-${notification.userId}`

    if (ws.io) {
      ws.io.of('/notifications/').to(room).emit('new-notification', notification)
    }
  }
}

export type INotification = Notification
