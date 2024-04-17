import { permissions } from '#helpers/enums'
import { hasPermission, isAdmin } from '#helpers/permission_helpers'
import { BasePolicy, action } from '@adonisjs/bouncer'

export default class ContactMessagePolicy extends BasePolicy {
  async viewList(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_CONTACT_MESSAGES))) {
      return true
    } else {
      return false
    }
  }

  async view(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_CONTACT_MESSAGES))) {
      return true
    } else {
      return false
    }
  }

  @action({ allowGuest: true })
  async create(user: any) {
    return true
  }

  async update(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_CONTACT_MESSAGES))) {
      return true
    } else {
      return false
    }
  }
  async delete(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_CONTACT_MESSAGES))) {
      return true
    } else {
      return false
    }
  }
}
