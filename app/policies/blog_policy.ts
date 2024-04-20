import { permissions } from '#helpers/enums'
import { hasPermission, isAdmin } from '#helpers/permission_helpers'
import { BasePolicy, action } from '@adonisjs/bouncer'

export default class BlogPolicy extends BasePolicy {
  @action({ allowGuest: true })
  async viewList() {
    return true
  }

  @action({ allowGuest: true })
  async view() {
    return true
  }

  async create(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_BLOGS))) {
      return true
    } else {
      return false
    }
  }
  async update(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_BLOGS))) {
      return true
    } else {
      return false
    }
  }
  async delete(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_BLOGS))) {
      return true
    } else {
      return false
    }
  }
}
