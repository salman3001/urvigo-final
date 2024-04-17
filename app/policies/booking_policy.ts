import { permissions } from '#helpers/enums'
import { hasPermission, isAdmin, isUser, isVendor } from '#helpers/permission_helpers'
import Booking from '#models/booking'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'

export default class BookingPolicy extends BasePolicy {
  async viewList(user: User) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_BOOKINGS))) {
      return true
    } else {
      return false
    }
  }

  async customerList(user: User) {
    if (isUser(user)) {
      return true
    } else {
      return false
    }
  }

  async vendorList(user: User) {
    if (isVendor(user)) {
      return true
    } else {
      return false
    }
  }

  async view(user: User, booking: Booking) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_BOOKINGS))) {
      return true
    } else if (isUser(user) && user.id === booking.userId) {
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
  async update(user: User, booking: Booking) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_BOOKINGS))) {
      return true
    } else if (isVendor(user) && user.id === booking.userId) {
      return true
    } else {
      return false
    }
  }
  async delete(user: User) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_BOOKINGS))) {
      return true
    } else {
      return false
    }
  }
}
