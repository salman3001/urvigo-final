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

  async myList(user: User) {
    if (user) {
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
    if (booking.userId === user.id) {
      return true
    } else if (isVendor(user)) {
      await user.load('businessProfile')
      return user.businessProfile.id === booking.businessProfileId
    } else {
      return false
    }
  }

  async create(user: User) {
    if (user) {
      return true
    } else {
      return false
    }
  }
  async update(user: User, booking: Booking) {
    if (booking.userId === user.id) {
      return true
    } else if (isVendor(user)) {
      await user.load('businessProfile')
      return user.businessProfile.id === booking.businessProfileId
    } else {
      return false
    }
  }
  async delete() {
    return false
  }
}
