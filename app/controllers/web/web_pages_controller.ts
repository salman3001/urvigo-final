// import type { HttpContext } from '@adonisjs/core/http'

import ServiceCategoryService from '#services/service_category_service'
import ServiceService from '#services/service_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WebPagesController {
  constructor(
    protected serviceService: ServiceService,
    protected categoryService: ServiceCategoryService
  ) {}

  //auth

  async home({ inertia }: HttpContext) {
    return inertia.render('home', {
      topServices: await this.serviceService.index(),
      meta: {
        disableSearchbar: true,
      },
    })
  }

  async services({ inertia }: HttpContext) {
    return inertia.render('services/service-list', {
      services: await this.serviceService.index(),
      categories: await this.categoryService.index(),
      meta: {
        disableSearchbar: true,
      },
    })
  }

  async services_show({ inertia }: HttpContext) {
    return inertia.render('services/service-list', {
      service: await this.serviceService.showBySlug(),
    })
  }

  // async businessProfile({ view }: HttpContext) {
  //   return view.render('pages/business/view', {})
  // }
}
