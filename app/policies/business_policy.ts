import { permissions } from '#helpers/enums'
import { hasPermission, isAdmin, isVendor } from '#helpers/permission_helpers'
import BusinessProfile from '#models/business_profile'
import { BasePolicy, action } from '@adonisjs/bouncer'

export default class BusinessPolicy extends BasePolicy {
  @action({ allowGuest: true })
  async viewList(user: any) {
    return true
  }

  @action({ allowGuest: true })
  async view(user: any) {
    return true
  }

  async create(user: any) {
    return false
  }

  async update(user: any, business: BusinessProfile) {
    if (isVendor(user)) {
      if (user.id === business.userId) {
        return true
      }
    }

    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_BUSINESS))) {
      return true
    } else {
      return false
    }
  }

  async delete(user: any, business: BusinessProfile) {
    if (isVendor(user)) {
      if (user.id === business.userId) {
        return true
      }
    }

    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_BUSINESS))) {
      return true
    } else {
      return false
    }
  }
}
