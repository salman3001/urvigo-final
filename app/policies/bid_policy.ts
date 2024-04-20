import { isVendor } from '#helpers/permission_helpers'
import Bid from '#models/bid'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'

export default class BidPolicy extends BasePolicy {
  async viewList() {
    return true
  }

  async view() {
    return true
  }
  async create(user: User) {
    if (isVendor(user)) {
      return true
    } else {
      return false
    }
  }
  async update(user: User, bid: Bid) {
    if (isVendor(user) && bid.userId === user.id) {
      return true
    } else {
      return false
    }
  }
  async delete(user: User, bid: Bid) {
    if (isVendor(user) && bid.userId === user.id) {
      return true
    } else {
      return false
    }
  }
}
