import { permissions } from '#helpers/enums'
import { hasPermission, isAdmin } from '#helpers/permission_helpers'
import User from '#models/user'
import { BasePolicy, action, allowGuest } from '@adonisjs/bouncer'

export default class UserPolicy extends BasePolicy {
  @allowGuest()
  async viewList() {
    return true
  }

  @allowGuest()
  async view() {
    return true
  }

  @action({ allowGuest: true })
  async create() {
    return true
  }

  async update(user: any, userModel: User) {
    if (user.id === userModel.id) {
      return true
    }
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_USER))) {
      return true
    } else {
      return false
    }
  }
  async delete(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_USER))) {
      return true
    } else {
      return false
    }
  }
}
