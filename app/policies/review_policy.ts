import User from '#models/user'
import { BasePolicy, action } from '@adonisjs/bouncer'
import logger from '@adonisjs/core/services/logger'

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
    logger.info({ user: user })
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
