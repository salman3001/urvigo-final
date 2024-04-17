import { permissions } from '#helpers/enums'
import { hasPermission, isAdmin } from '#helpers/permission_helpers'
import { BasePolicy } from '@adonisjs/bouncer'

export default class CampaignPolicy extends BasePolicy {
  async viewList(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_CAMPAIGNS))) {
      return true
    } else {
      return false
    }
  }

  async view(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_CAMPAIGNS))) {
      return true
    } else {
      return false
    }
  }

  async create(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_CAMPAIGNS))) {
      return true
    } else {
      return false
    }
  }
  async update(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_CAMPAIGNS))) {
      return true
    } else {
      return false
    }
  }
  async delete(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_CAMPAIGNS))) {
      return true
    } else {
      return false
    }
  }
}
