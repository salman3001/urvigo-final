import type { HttpContext } from '@adonisjs/core/http'
import ServiceCategoryService from '../../services/service_category_service.js'

export default class ApiServiceCategoriesController {
  constructor(protected serviceCategoryService: ServiceCategoryService) {}

  async index({ response }: HttpContext) {
    const category = await this.serviceCategoryService.index()
    return response.custom({
      code: 200,
      data: category,
      message: null,
      success: true,
    })
  }

  async show({ response }: HttpContext) {
    const category = await this.serviceCategoryService.showBySlug()
    return response.custom({
      code: 200,
      data: category,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const category = await this.serviceCategoryService.store()
    return response.custom({
      code: 200,
      data: category,
      message: 'Category Created',
      success: true,
    })
  }

  async update({ response }: HttpContext) {
    const category = await this.serviceCategoryService.update()
    return response.custom({
      code: 200,
      data: category,
      message: 'Category Updated',
      success: true,
    })
  }

  async destroy({ response }: HttpContext) {
    const category = await this.serviceCategoryService.destroy()
    return response.custom({
      code: 200,
      data: category,
      message: 'Category Deleted',
      success: true,
    })
  }
}
