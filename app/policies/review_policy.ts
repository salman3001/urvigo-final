import Review from '#models/review'
import User from '#models/user'
import { BasePolicy, action } from '@adonisjs/bouncer'
import logger from '@adonisjs/core/services/logger'

export default class ReviewPolicy extends BasePolicy {
  @action({ allowGuest: true })
  async viewList(user: User) {
    return true
  }

  @action({ allowGuest: true })
  async view(user: User) {
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
  async update(user: User) {
    return false
  }
  async delete(authUser: User, review: Review) {
    await authUser.load('businessProfile')
    if (review.businessProfileId === authUser?.businessProfile?.id) {
      return true
    } else {
      return false
    }
  }
}
