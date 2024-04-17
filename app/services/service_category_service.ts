import ServiceCategory from '#models/serviceCategory'
import BaseService from '#services/base_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ServiceCategoryService extends BaseService {
  constructor(protected ctx: HttpContext) {
    super()
  }

  protected searchByFileds(): string[] {
    return ['name']
  }

  async index() {
    const { bouncer, request } = this.ctx
    await bouncer.with('ServiceCategoryPolicy').authorize('viewList')

    const serviceCategoryQuery = ServiceCategory.query()

    this.applyFilters(serviceCategoryQuery, request.qs())

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
