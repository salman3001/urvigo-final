import { BasePolicy } from '@adonisjs/bouncer'

export default class WishlistPolicy extends BasePolicy {
  async viewList() {
    return false
  }

  async view() {
    return true
  }

  async create() {
    // if (user && user instanceof User) {
    //   return true
    // } else {
    //   return false
    // }
    return false
  }

  async update() {
    return true
  }

  async delete() {
    return true
  }
}
