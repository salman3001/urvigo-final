import type { HttpContext } from '@adonisjs/core/http'
import ServiceService from '../../services/service_service.js'

export default class ApiServicesController {
  constructor(protected serviceService: ServiceService) {}

  async index({ response }: HttpContext) {
    const services = await this.serviceService.index()
    return response.custom({
      code: 200,
      data: services,
      message: null,
      success: true,
    })
  }

  async myList({ response }: HttpContext) {
    const services = await this.serviceService.myList()
    return response.custom({
      code: 200,
      data: services,
      message: null,
      success: true,
    })
  }

  async show({ response }: HttpContext) {
    const services = await this.serviceService.showBySlug()
    return response.custom({
      code: 200,
      data: services,
      message: null,
      success: true,
    })
  }

  async similarServices({ response }: HttpContext) {
    const services = await this.serviceService.similarServices()
    return response.custom({
      code: 200,
      data: services,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const service = await this.serviceService.store()
    return response.custom({
      code: 200,
      data: service,
      message: 'Service Created',
      success: true,
    })
  }

  async update({ response }: HttpContext) {
    const service = await this.serviceService.update()
    return response.custom({
      code: 200,
      data: service,
      message: 'Service Updated',
      success: true,
    })
  }

  async destroy({ response }: HttpContext) {
    const service = await this.serviceService.destroy()
    return response.custom({
      code: 200,
      data: service,
      message: 'Service Deleted',
      success: true,
    })
  }

  async deleteImages({ response }: HttpContext) {
    const service = await this.serviceService.deleteImages()
    return response.custom({
      code: 200,
      data: service,
      message: 'Image Deleted',
      success: true,
    })
  }
}
