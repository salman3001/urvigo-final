import { isAdmin } from '#helpers/permission_helpers'
import Notification from '#models/notification'
import { BasePolicy } from '@adonisjs/bouncer'

export default class NotificationPolicy extends BasePolicy {
  async viewList(user: any) {
    return false
  }

  async view(user: any, notification: Notification) {
    return false
  }

  async create(user: any) {
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
