import type { HttpContext } from '@adonisjs/core/http'
import ServiceRequirementService from '#services/service_requirement_service'
import { inject } from '@adonisjs/core'

@inject()
export default class ApiServiceRequirementsController {
  constructor(protected requirementService: ServiceRequirementService) {}

  async index({ response }: HttpContext) {
    const requirements = await this.requirementService.index()
    return response.custom({
      code: 200,
      data: requirements,
      message: null,
      success: true,
    })
  }

  async myList({ response }: HttpContext) {
    const requirement = await this.requirementService.myList()
    return response.custom({
      code: 200,
      data: requirement,
      message: null,
      success: true,
    })
  }

  async show({ response }: HttpContext) {
    const requirement = await this.requirementService.show()
    return response.custom({
      code: 200,
      data: requirement,
      message: null,
      success: true,
    })
  }

  async showBids({ response }: HttpContext) {
    const bids = await this.requirementService.showBids()
    return response.custom({
      code: 200,
      data: bids,
      message: null,
      success: true,
    })
  }

  async showAcceptedBid({ response }: HttpContext) {
    const bid = await this.requirementService.showAcceptedBid()
    return response.custom({
      code: 200,
      data: bid,
      message: null,
      success: true,
    })
  }

  async showVendorPlacedbid({ response }: HttpContext) {
    const data = await this.requirementService.showVendorPlacedbid()
    if (data === 'Unautorized') {
      return response.custom({
        code: 400,
        data: null,
        message: 'Unauthorized',
        success: true,
      })
    }
    return response.custom({
      code: 200,
      data: data,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const requirement = await this.requirementService.store()
    return response.custom({
      code: 200,
      data: requirement,
      message: 'Requirement Created',
      success: true,
    })
  }

  async update({ response }: HttpContext) {
    const requirement = await this.requirementService.update()
    return response.custom({
      code: 200,
      data: requirement,
      message: 'Requirement Updated',
      success: true,
    })
  }

  async destroy({ response }: HttpContext) {
    const requirement = await this.requirementService.destroy()
    return response.custom({
      code: 200,
      data: requirement,
      message: 'Requirement Deleted',
      success: true,
    })
  }

  async negotiate({ response }: HttpContext) {
    const data = await this.requirementService.negotiate()
    if (data === 'Last Request Pending') {
      return response.custom({
        code: 400,
        data: null,
        message: 'Last Negotiate request in still pending',
        success: true,
      })
    }
    return response.custom({
      code: 200,
      data: data,
      message: null,
      success: true,
    })
  }
}
