import ServiceCategory from '#models/service_category'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ServiceCategoryService {
  constructor(protected ctx: HttpContext) {}

  protected searchByFileds(): string[] {
    return ['name']
  }

  async index() {
    const { bouncer, request } = this.ctx
    await bouncer.with('ServiceCategoryPolicy').authorize('viewList')

    const serviceCategoryQuery = ServiceCategory.query()

    const categories = await serviceCategoryQuery.exec()

    return categories
  }

  async showBySlug() {
    const { bouncer, params } = this.ctx
    await bouncer.with('ServiceCategoryPolicy').authorize('view')

    const slug = params.slug
    const serviceCategoryQuery = ServiceCategory.query()
      .where('slug', slug)
      .preload('faqs')
      .preload('services', (s) => {
        s.limit(20)
      })

    const service = await serviceCategoryQuery.first()

    return service
  }
}
