import { permissions } from '#helpers/enums'
import { hasPermission, isAdmin, isUser, isVendor } from '#helpers/permission_helpers'
import BidBooking from '#models/bid_booking'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'

export default class BidBookingPolicy extends BasePolicy {
  async viewList(user: User) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_BID_BOOKINGS))) {
      return true
    } else {
      false
    }
  }

  async myList(user: User) {
    if (user) {
      return true
    } else {
      return false
    }
  }

  async view(user: User, bidBooking: BidBooking) {
    if (user instanceof User && bidBooking.userId === user.id) {
      return true
    } else if (isVendor(user) && bidBooking.userId === user.id) {
      return true
    } else {
      return false
    }
  }
  async create(user: User) {
    if (isUser(user)) {
      return true
    } else {
      return false
    }
  }
  async update(user: User, bidBooking: BidBooking) {
    if (isVendor(user) && bidBooking.userId === user.id) {
      return true
    } else {
      return false
    }
  }
  async delete(user: User, bidBooking: BidBooking) {
    return false
  }
}
