import ServiceTag from '#models/service_tag'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ServiceTagService {
  constructor(protected ctx: HttpContext) {}

  async index() {
    const { bouncer } = this.ctx
    await bouncer.with('ServiceCategoryPolicy').authorize('viewList')

    const serviceTagQuery = ServiceTag.query()

    const categories = await serviceTagQuery.exec()

    return categories
  }

  async showBySlug() {
    const { bouncer, params } = this.ctx
    await bouncer.with('ServiceCategoryPolicy').authorize('view')

    const slug = params.slug
    const serviceTagQuery = ServiceTag.query().where('slug', slug).preload('faqs')

    const service = await serviceTagQuery.first()

    return service
  }
}
