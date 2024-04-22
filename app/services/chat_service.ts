import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Conversation from '../models/conversation.js'
import { paginate } from '../helpers/common.js'
import Message from '../models/message.js'
import { conversationValidator, messageValidator } from '../validators/chat.js'
import db from '@adonisjs/lucid/services/db'
import ConversationParticipant from '../models/conversation_participant.js'
import { DateTime } from 'luxon'
import { IndexOption } from '../helpers/types.js'

@inject()
export default class ChatService {
  constructor(protected ctx: HttpContext) {}

  async index(opt?: IndexOption) {
    const { request, bouncer, auth } = this.ctx
    await bouncer.with('ConversationPolicy').authorize('viewList')
    const conversationQuery = Conversation.query()
      .where('participant_one_id', auth.user!.id)
      .orWhere('participant_two_id', auth.user!.id)
      .preload('participantOne', (s) => {
        s.preload('user', (u) => {
          u.preload('profile', (p) => {
            p.select('avatar')
          })
        })
      })
      .preload('participantTwo', (s) => {
        s.preload('user', (u) => {
          u.preload('profile', (p) => {
            p.select('avatar')
          })
        })
      })
      .preload('messages', (m) => {
        m.orderBy('created_at', 'desc').limit(1)
      })
      .orderBy('created_at', 'desc')

    !opt?.disableFilter && conversationQuery.filter(request.qs())
    const conversations = await paginate(conversationQuery, request)

    return conversations
  }

  async getConversationMessages() {
    const { params, bouncer, request } = this.ctx
    const conversation = await Conversation.findOrFail(+params.id)

    await bouncer.with('ConversationPolicy').authorize('view', conversation)

    const messagesQuery = Message.query()
      .where('conversation_id', conversation.id)
      .orderBy('created_at', 'desc')

    const messages = await paginate(messagesQuery, request)

    return messages
  }

  async store() {
    const { request, bouncer, auth } = this.ctx
    await bouncer.with('ConversationPolicy').authorize('create')
    const payload = await request.validateUsing(conversationValidator)

    let conversation: Conversation | null = null
    const participantOneId = auth.user!.id
    const participantTwoId = payload.participantId

    conversation = await Conversation.query()
      .where((b) => {
        b.where('participant_one_id', participantOneId).andWhere(
          'participant_two_id',
          participantOneId
        )
      })
      .orWhere((b) => {
        b.where('participant_two_id', participantTwoId).andWhere(
          'participant_one_id',
          participantTwoId
        )
      })
      .first()

    if (conversation) {
      return 'already exist'
    }

    if (!conversation) {
      await db.transaction(async (trx) => {
        conversation = await Conversation.create({ name: payload.name }, { client: trx })
        const participantOne = await ConversationParticipant.create(
          {
            userId: auth!.user!.id,
          },
          { client: trx }
        )

        await conversation.related('participantOne').associate(participantOne)
        await conversation.save()

        const participantTwo = await ConversationParticipant.create(
          {
            userId: payload.participantId,
          },
          { client: trx }
        )

        await conversation.related('participantTwo').associate(participantTwo)
        await conversation.save()
      })
    }

    return conversation!
  }

  async createMessage() {
    const { request, bouncer, params, auth } = this.ctx
    const conversation = await Conversation.findOrFail(+params.id)
    await bouncer.with('ConversationPolicy').authorize('update', conversation)

    const payload = await request.validateUsing(messageValidator)

    const message = new Message()

    await db.transaction(async (trx) => {
      message.useTransaction(trx)
      message.body = payload.body
      message.conversationId = conversation.id
      message.userId = auth.user!.id
      await message.save()
      conversation.useTransaction(trx)
      conversation.merge({ updatedAt: DateTime.now() })
      await conversation.save()
    })

    return message
  }

  async markAllAsRead(): Promise<'Marked As read'> {
    const { bouncer, params, auth } = this.ctx
    const conversation = await Conversation.findOrFail(+params.id)
    await bouncer.with('ConversationPolicy').authorize('update', conversation)

    await conversation
      .related('messages')
      .query()
      .where('user_id', auth.user!.id)
      .where('read', 0)
      .update({ read: 1 })
      .exec()

    return 'Marked As read'
  }

  async destroy(): Promise<'Record Deleted'> {
    const { params, bouncer } = this.ctx
    const conversation = await Conversation.findOrFail(+params.id)

    await bouncer.with('ConversationPolicy').authorize('delete')

    await conversation.delete()

    return 'Record Deleted'
  }
}
