import { permissions } from '#helpers/enums'
import { hasPermission, isAdmin, isVendor } from '#helpers/permission_helpers'
import Service from '#models/service'
import User from '#models/user'
import { BasePolicy, action } from '@adonisjs/bouncer'

export default class ServicePolicy extends BasePolicy {
  @action({ allowGuest: true })
  async viewList() {
    return true
  }

  @action({ allowGuest: true })
  async view() {
    return true
  }

  async myList(user: User) {
    if (user) {
      return true
    } else {
      false
    }
  }

  async create(user: User) {
    if (isVendor(user)) {
      return true
    }
  }

  async update(user: User, service: Service) {
    if (isVendor(user)) {
      await user.load('businessProfile')
      if (user.businessProfile.id === service.businessProfileId) {
        return true
      }
    }

    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_SERVICE))) {
      return true
    } else {
      return false
    }
  }

  async delete(user: any, service: Service) {
    if (isVendor(user)) {
      await user.load('businessProfile')
      if (user.businessProfile.id === service.businessProfileId) {
        return true
      }
    }

    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_SERVICE))) {
      return true
    } else {
      return false
    }
  }
}
