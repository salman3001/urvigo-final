import User from '#models/user'
import { BasePolicy, action } from '@adonisjs/bouncer'

export default class ReviewPolicy extends BasePolicy {
  @action({ allowGuest: true })
  async viewList() {
    return true
  }

  @action({ allowGuest: true })
  async view() {
    return true
  }

  async create(user: User) {
    if (user) {
      return true
    } else {
      return false
    }
  }
  async update() {
    return false
  }
  async delete() {
    return false
  }
}
