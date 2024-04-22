import type { HttpContext } from '@adonisjs/core/http'
import ServiceSubategoryService from '../../services/service_subcategory_service.js'

export default class ApiServiceSubcategoriesController {
  constructor(protected serviceSubcategoryService: ServiceSubategoryService) {}

  async index({ response }: HttpContext) {
    const subcategory = await this.serviceSubcategoryService.index()
    return response.custom({
      code: 200,
      data: subcategory,
      message: null,
      success: true,
    })
  }

  async show({ response }: HttpContext) {
    const subcategory = await this.serviceSubcategoryService.showBySlug()
    return response.custom({
      code: 200,
      data: subcategory,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const subcategory = await this.serviceSubcategoryService.store()
    return response.custom({
      code: 200,
      data: subcategory,
      message: 'Subcategory Created',
      success: true,
    })
  }

  async update({ response }: HttpContext) {
    const subcategory = await this.serviceSubcategoryService.update()
    return response.custom({
      code: 200,
      data: subcategory,
      message: 'Subcategory Updated',
      success: true,
    })
  }

  async destroy({ response }: HttpContext) {
    const subcategory = await this.serviceSubcategoryService.destroy()
    return response.custom({
      code: 200,
      data: subcategory,
      message: 'Subcategory Deleted',
      success: true,
    })
  }
}
