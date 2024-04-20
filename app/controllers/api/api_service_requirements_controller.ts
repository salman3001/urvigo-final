import type { HttpContext } from '@adonisjs/core/http'
import ServiceRequirementService from '#services/service_requirement_service'
import { inject } from '@adonisjs/core'

@inject()
export default class ApiServiceRequirementsController {
  constructor(protected requirementService: ServiceRequirementService) {}

  async showBids({ response }: HttpContext) {
    const bids = await this.requirementService.showBids()
    return response.custom({
      code: 200,
      data: bids,
      message: null,
      success: true,
    })
  }
}
