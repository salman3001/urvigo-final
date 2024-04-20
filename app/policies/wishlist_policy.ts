import { isUser } from '#helpers/permission_helpers'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'

export default class WishlistPolicy extends BasePolicy {
  async viewList() {
    return false
  }

  async view(user: User) {
    if (isUser(user)) {
      return true
    } else {
      return false
    }
  }
  async create() {
    // if (user && user instanceof User) {
    //   return true
    // } else {
    //   return false
    // }
    return false
  }

  async update(user: User) {
    if (isUser(user)) {
      return true
    } else {
      return false
    }
  }

  async delete(user: User) {
    if (isUser(user)) {
      return true
    } else {
      return false
    }
  }
}
