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

  async home({ view }: HttpContext) {
    const services = await this.serviceService.index()
    const categories = await this.categoryService.index()
    services.baseUrl('/')
    return view.render('pages/home', {
      services,
      categories,
    })
  }

  // async businessProfile({ view }: HttpContext) {
  //   return view.render('pages/business/view', {})
  // }
}
