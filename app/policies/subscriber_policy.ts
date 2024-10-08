import { permissions } from '#helpers/enums'
import { hasPermission, isAdmin } from '#helpers/permission_helpers'
import User from '#models/user'
import { BasePolicy, action } from '@adonisjs/bouncer'

export default class SubscriberPolicy extends BasePolicy {
  async viewList(user: User) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_SUBSCRIBERS))) {
      return true
    } else {
      return false
    }
  }

  async view(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_SUBSCRIBERS))) {
      return true
    } else {
      return false
    }
  }

  @action({ allowGuest: true })
  async create() {
    return true
  }

  async update(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_SUBSCRIBERS))) {
      return true
    } else {
      return false
    }
  }
  async delete(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_SUBSCRIBERS))) {
      return true
    } else {
      return false
    }
  }
}
