import Conversation from '#models/conversation'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'

export default class ConversationPolicy extends BasePolicy {
  async viewList() {
    return true
  }

  async view(user: User, conversation: Conversation) {
    if (conversation.participantOneId === user.id || conversation.participantTwoId === user.id) {
      return true
    } else {
      return false
    }
  }

  async create() {
    return true
  }

  async update(user: User, conversation: Conversation) {
    if (conversation.participantOneId === user.id || conversation.participantTwoId === user.id) {
      return true
    } else {
      return false
    }
  }
  async delete() {
    return false
  }
}
