import Notification from '#models/notification'
import { BasePolicy } from '@adonisjs/bouncer'

export default class NotificationPolicy extends BasePolicy {
  async viewList() {
    return true
  }

  async view() {
    return true
  }

  async create() {
    return false
  }

  async update(user: any, notification: Notification) {
    if (notification.userId === user.id) {
      return true
    } else {
      return false
    }
  }

  async delete(user: any, notification: Notification) {
    if (notification.userId === user.id) {
      return true
    } else {
      return false
    }
  }
}
