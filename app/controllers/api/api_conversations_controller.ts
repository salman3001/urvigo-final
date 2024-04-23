import type { HttpContext } from '@adonisjs/core/http'
import ChatService from '../../services/chat_service.js'
import { inject } from '@adonisjs/core'

@inject()
export default class ApiConversationsController {
  constructor(protected chatService: ChatService) {}

  async index({ response }: HttpContext) {
    const chats = await this.chatService.index()
    return response.custom({
      code: 200,
      data: chats,
      message: null,
      success: true,
    })
  }

  async getConversationMessages({ response }: HttpContext) {
    const messages = await this.chatService.getConversationMessages()
    return response.custom({
      code: 200,
      data: messages,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const data = await this.chatService.store()
    if (data === 'already exist') {
      return response.custom({
        code: 400,
        data: data,
        message: 'Chat Alreay Exist',
        success: false,
      })
    } else {
      return response.custom({
        code: 200,
        data: data,
        message: 'Chat created',
        success: true,
      })
    }
  }

  async createMessage({ response }: HttpContext) {
    const message = await this.chatService.createMessage()

    return response.custom({
      code: 200,
      data: message,
      message: 'Message created',
      success: true,
    })
  }

  async update({ response }: HttpContext) {
    const message = await this.chatService.createMessage()

    return response.custom({
      code: 200,
      data: message,
      message: 'Message Created',
      success: true,
    })
  }

  async markAllAsRead({ response }: HttpContext) {
    await this.chatService.markAllAsRead()

    return response.custom({
      code: 200,
      data: null,
      message: 'Marked As read',
      success: true,
    })
  }

  async destroy({ response }: HttpContext) {
    await this.chatService.destroy()

    return response.custom({
      code: 200,
      data: null,
      message: 'Chat Deleted',
      success: true,
    })
  }
}
