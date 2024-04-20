import { isAdmin } from '#helpers/permission_helpers'
import Notification from '#models/notification'
import { BasePolicy } from '@adonisjs/bouncer'

export default class NotificationPolicy extends BasePolicy {
  async viewList() {
    return false
  }

  async view() {
    return false
  }

  async create() {
    return false
  }

  async update(user: any, notification: Notification) {
    if (notification.userId === user.id) {
      return true
    } else if (!isAdmin(user) && notification.userId === user.id) {
      return true
    } else {
      return false
    }
  }

  async delete(user: any, notification: Notification) {
    if (notification.userId === user.id) {
      return true
    } else if (!isAdmin(user) && notification.userId === user.id) {
      return true
    } else {
      return false
    }
  }
}
