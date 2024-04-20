import ServiceSubcategory from '#models/service_subcategory'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ServiceSubategoryService {
  constructor(protected ctx: HttpContext) {}

  async index() {
    const { bouncer } = this.ctx
    await bouncer.with('ServiceCategoryPolicy').authorize('viewList')

    const serviceCategoryQuery = ServiceSubcategory.query()

    const categories = await serviceCategoryQuery.exec()

    return categories
  }

  async showBySlug() {
    const { bouncer, params } = this.ctx
    await bouncer.with('ServiceCategoryPolicy').authorize('view')

    const slug = params.slug
    const serviceCategoryQuery = ServiceSubcategory.query()
      .where('slug', slug)
      .preload('faqs')
      .preload('services', (s) => {
        s.limit(20)
      })

    const service = await serviceCategoryQuery.first()

    return service
  }
}
