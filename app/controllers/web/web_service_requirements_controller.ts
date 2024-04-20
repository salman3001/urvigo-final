import type { HttpContext } from '@adonisjs/core/http'

import ServiceRequirementService from '#services/service_requirement_service'
import { inject } from '@adonisjs/core'
import ServiceCategoryService from '#services/service_category_service'
import ServiceTagService from '#services/service_tag_service'

@inject()
export default class WebServiceRequirementsController {
  constructor(
    protected serviceRequirementService: ServiceRequirementService,
    protected serviceCategoryService: ServiceCategoryService,
    protected tagService: ServiceTagService
  ) {}

  index({ inertia }: HttpContext) {
    return inertia.render('service-requirements/requirement-list', {
      requirements: () => this.serviceRequirementService.myList(),
      categories: () => this.serviceCategoryService.index(),
      tags: () => this.tagService.index(),
    })
  }

  show({ inertia }: HttpContext) {
    return inertia.render('service-requirements/requirement-show', {
      requirement: () => this.serviceRequirementService.show(),
      acceptedBid: () => this.serviceRequirementService.showAcceptedBid(),
    })
  }

  async create({ response, session }: HttpContext) {
    const data = await this.serviceRequirementService.store()
    console.log(data)

    session.flash('flash', {
      message: 'Requirement Created',
      type: 'success',
    })
    return response.redirect().toRoute('web.service_requirement.list')
  }
}
