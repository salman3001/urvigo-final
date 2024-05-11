import type { HttpContext } from '@adonisjs/core/http'
import notificationsService from '../../services/notification_service.js'
import { inject } from '@adonisjs/core'

@inject()
export default class ApiNotificationsController {
  constructor(protected notificationService: notificationsService) {}
  async index({ response }: HttpContext) {
    const notifications = await this.notificationService.index()
    return response.custom({
      code: 200,
      data: notifications,
      message: null,
      success: true,
    })
  }

  async getMenuNotifications({ response }: HttpContext) {
    const notifications = await this.notificationService.getMenuNotifications()
    return response.custom({
      code: 200,
      data: notifications,
      message: null,
      success: true,
    })
  }

  async markAsRead({ response }: HttpContext) {
    await this.notificationService.markAsRead()
    return response.custom({
      code: 200,
      data: null,
      message: 'Marked as read',
      success: true,
    })
  }

  async markAsUnread({ response }: HttpContext) {
    await this.notificationService.markAsUnRead()
    return response.custom({
      code: 200,
      data: null,
      message: 'Marked as unread',
      success: true,
    })
  }

  async destroy({ response }: HttpContext) {
    await this.notificationService.destroy()
    return response.custom({
      code: 200,
      data: null,
      message: 'Notification Deleted',
      success: true,
    })
  }

  async destroyRead({ response }: HttpContext) {
    await this.notificationService.destroyRead()
    return response.custom({
      code: 200,
      data: null,
      message: 'Notifications Deleted',
      success: true,
    })
  }

  async destroyAll({ response }: HttpContext) {
    await this.notificationService.destroyAll()
    return response.custom({
      code: 200,
      data: null,
      message: 'All Notifications Deleted',
      success: true,
    })
  }
}
