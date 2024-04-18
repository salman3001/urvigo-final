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
      topServices: () => this.serviceService.index(),
      meta: {
        disableSearchbar: true,
      },
    })
  }

  async services({ inertia }: HttpContext) {
    return inertia.render('services/service-list', {
      services: () => this.serviceService.index(),
      categories: () => this.categoryService.index(),
      meta: {
        disableSearchbar: true,
      },
    })
  }

  async services_show({ inertia }: HttpContext) {
    return inertia.render('services/service-show', {
      service: () => this.serviceService.showBySlug(),
      similarServices: () => this.serviceService.similarServices(),
    })
  }

  async createReview({ response, session }: HttpContext) {
    const data = await this.serviceService.createReview()
    if (data === 'Review Exit') {
      session.flash({
        message: 'You have already reviews this service',
        type: 'error',
      })

      return response.redirect().back()
    } else {
      session.flash({ message: 'Review added', type: 'success' })
      return response.redirect().back()
    }
  }

  // async businessProfile({ view }: HttpContext) {
  //   return view.render('pages/business/view', {})
  // }
}
