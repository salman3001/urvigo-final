import type { HttpContext } from '@adonisjs/core/http'
import ServiceTagService from '../../services/service_tag_service.js'

export default class ApiServiceTagsController {
  constructor(protected serviceTag: ServiceTagService) {}

  async index({ response }: HttpContext) {
    const tag = await this.serviceTag.index()
    return response.custom({
      code: 200,
      data: tag,
      message: null,
      success: true,
    })
  }

  async show({ response }: HttpContext) {
    const tag = await this.serviceTag.showBySlug()
    return response.custom({
      code: 200,
      data: tag,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const tag = await this.serviceTag.store()
    return response.custom({
      code: 200,
      data: tag,
      message: 'tag Created',
      success: true,
    })
  }

  async update({ response }: HttpContext) {
    const tag = await this.serviceTag.update()
    return response.custom({
      code: 200,
      data: tag,
      message: 'tag Updated',
      success: true,
    })
  }

  async destroy({ response }: HttpContext) {
    const tag = await this.serviceTag.destroy()
    return response.custom({
      code: 200,
      data: tag,
      message: 'tag Deleted',
      success: true,
    })
  }
}
