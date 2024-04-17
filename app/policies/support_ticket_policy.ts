import { permissions } from '#helpers/enums'
import { hasPermission, isAdmin, isVendor } from '#helpers/permission_helpers'
import SupportTicket from '#models/support_ticket'
import User from '#models/user'
import { BasePolicy, action } from '@adonisjs/bouncer'

export default class SupportTicketPolicy extends BasePolicy {
  async viewList(user: User) {
    if (user) {
      return true
    } else {
      return false
    }
  }

  async view(user: User, ticket: SupportTicket) {
    if (isVendor(user) && ticket.userId === user.id) {
      return true
    }

    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TICKETS))) {
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
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TICKETS))) {
      return true
    } else {
      return false
    }
  }

  async delete(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TICKETS))) {
      return true
    } else {
      return false
    }
  }
}
