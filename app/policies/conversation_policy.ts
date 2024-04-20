import Conversation from '#models/conversation'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'

export default class ConversationPolicy extends BasePolicy {
  async viewList() {
    return true
  }

  async view(user: User, conversation: Conversation) {
    if (conversation.participantOne.id === user.id || conversation.participantTwo.id === user.id) {
      return true
    } else {
      return false
    }
  }

  async create() {
    return true
  }

  async update(user: User, conversation: Conversation) {
    if (conversation.participantOne.id === user.id || conversation.participantTwo.id === user.id) {
      return true
    } else {
      return false
    }
  }
  async delete() {
    return false
  }
}
