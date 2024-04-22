import type { HttpContext } from '@adonisjs/core/http'

import BlogService from '../../services/blog_service.js'

export default class ApiBlogsController {
  constructor(protected blogService: BlogService) {}

  async index({ response }: HttpContext) {
    const blogs = await this.blogService.index()
    return response.custom({
      code: 200,
      data: blogs,
      message: null,
      success: true,
    })
  }

  async show({ response }: HttpContext) {
    const blog = await this.blogService.show()
    return response.custom({
      code: 200,
      data: blog,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const blog = await this.blogService.store()
    return response.custom({
      code: 200,
      data: blog,
      message: 'Blog Created',
      success: true,
    })
  }

  async upadate({ response }: HttpContext) {
    const blog = await this.blogService.update()
    return response.custom({
      code: 200,
      data: blog,
      message: 'Blog Updated',
      success: true,
    })
  }

  async destroy({ response }: HttpContext) {
    const blog = await this.blogService.destroy()
    return response.custom({
      code: 200,
      data: blog,
      message: 'Blog deleted',
      success: true,
    })
  }
}
