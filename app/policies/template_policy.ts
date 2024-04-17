import { permissions } from '#helpers/enums'
import { hasPermission, isAdmin } from '#helpers/permission_helpers'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'

export default class TemplatePolicy extends BasePolicy {
  async viewList(user: User) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TEMPLATES))) {
      return true
    } else {
      return false
    }
  }

  async view(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TEMPLATES))) {
      return true
    } else {
      return false
    }
  }

  async create(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TEMPLATES))) {
      return true
    } else {
      return false
    }
  }

  async update(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TEMPLATES))) {
      return true
    } else {
      return false
    }
  }
  async delete(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TEMPLATES))) {
      return true
    } else {
      return false
    }
  }
}
