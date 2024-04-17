import Service from '#models/service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import config from '@adonisjs/core/services/config'

@inject()
export default class ServiceService {
  constructor(protected ctx: HttpContext) {}

  async index() {
    const { bouncer, request } = this.ctx
    await bouncer.with('ServicePolicy').authorize('viewList')

    const serviceQuery = Service.query()
      .preload('serviceCategory', (s) => {
        s.select(['name'])
      })
      .preload('images')
      .preload('variants', (v) => {
        v.select(['name'])
      })
      .select([
        'id',
        'name',
        'slug',
        'short_desc',
        'is_active',
        'geo_location',
        'avg_rating',
        'business_profile_id',
        'service_category_id',
        'service_subcategory_id',
      ])

    return await serviceQuery.paginate(
      request.qs()?.page || 1,
      request.qs()?.perPage || config.get('common.rowsPerPage')
    )
  }

  async showBySlug() {
    const { bouncer, params } = this.ctx
    await bouncer.with('ServicePolicy').authorize('view')

    const slug = params.slug
    const serviceQuery = Service.query()
      .where('slug', slug)
      .preload('variants')
      .preload('businessProfile', (v) => {
        v.withCount('reviews')
      })
      .preload('reviews', (r) => {
        r.limit(10)
      })

    const service = await serviceQuery.first()

    return service
  }
}
