import { DateTime } from 'luxon'
import { column, BaseModel, afterCreate } from '@adonisjs/lucid/orm'
import { NotificationTypes } from '#helpers/enums'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare data: {
    type: NotificationTypes
    message: string
    meta: Record<any, any>
  }

  @column()
  declare userId: number

  async markAsRead() {
    this.readAt = DateTime.now()
    await this.save()
  }

  @column.dateTime()
  declare readAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // @afterCreate()
  // static pushNotification(notification: Notification) {
  //   let room = ''
  //   if (notification.userId) {
  //     room = `user:${notification.userId}`
  //   }
  //   // Ws.io.of('/notifications/').to(room).emit('new-notification', notification)
  // }
}
