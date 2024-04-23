import type { HttpContext } from '@adonisjs/core/http'

import BlogCategoryService from '../../services/blog_category_service.js'
import { inject } from '@adonisjs/core'

@inject()
export default class ApiBlogCategoriesController {
  constructor(protected blogCategoryService: BlogCategoryService) {}

  async index({ response }: HttpContext) {
    const categories = await this.blogCategoryService.index()
    return response.custom({
      code: 200,
      data: categories,
      message: null,
      success: true,
    })
  }

  async show({ response }: HttpContext) {
    const category = await this.blogCategoryService.show()
    return response.custom({
      code: 200,
      data: category,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const category = await this.blogCategoryService.store()
    return response.custom({
      code: 200,
      data: category,
      message: 'Category Created',
      success: true,
    })
  }

  async update({ response }: HttpContext) {
    const category = await this.blogCategoryService.update()
    return response.custom({
      code: 200,
      data: category,
      message: 'Category Updated',
      success: true,
    })
  }

  async destroy({ response }: HttpContext) {
    const category = await this.blogCategoryService.destroy()
    return response.custom({
      code: 200,
      data: category,
      message: 'Category Deleted',
      success: true,
    })
  }
}
