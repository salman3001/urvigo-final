import Review from '#models/review'
import Service from '#models/service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import config from '@adonisjs/core/services/config'
import { CreateServiceReviewValidator } from '#validators/service'
import ReviewPolicy from '#policies/review_policy'

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
      .preload('serviceSubcategory', (s) => {
        s.select(['id', 'name'])
      })
      .preload('tags', (s) => {
        s.select(['id', 'name'])
      })
      .preload('images')
      .preload('variants')
      .select([
        'id',
        'name',
        'slug',
        'short_desc',
        'is_active',
        'geo_location',
        'thumbnail',
        'avg_rating',
        'service_category_id',
        'service_subcategory_id',
        'created_at',
      ])
      .withCount('reviews', (r) => {
        r.as('reviews_count')
      })
      .withAggregate('variants', (v) => {
        v.min('price').as('starting_from')
      })

    serviceQuery.filter(request.qs())

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
        v.preload('user')
      })
      .preload('reviews', (r) => {
        r.preload('user', (u) => {
          u.select(['first_name', 'last_name']).preload('profile', (p) => {
            p.select('avatar')
          })
        })
        r.limit(10)
      })
      .preload('faq')
      .preload('seo')
      .preload('tags')
      .preload('images')
      .withCount('reviews', (r) => {
        r.as('reviews_count')
      })

    const service = await serviceQuery.first()

    return service
  }

  async similarServices() {
    const { bouncer, params } = this.ctx
    await bouncer.with('ServicePolicy').authorize('viewList')

    const service = await Service.query().where('slug', params?.slug).first()
    let services: Service[] = []

    if (service) {
      services = await Service.query()
        .whereHas('serviceCategory', (s) => {
          s.where('id', service.serviceCategoryId)
        })
        .preload('serviceCategory', (s) => {
          s.select(['name'])
        })
        .preload('serviceSubcategory', (s) => {
          s.select(['id', 'name'])
        })
        .preload('tags', (s) => {
          s.select(['id', 'name'])
        })
        .preload('images')
        .preload('variants')
        .select([
          'id',
          'name',
          'slug',
          'short_desc',
          'is_active',
          'geo_location',
          'thumbnail',
          'avg_rating',
          'service_category_id',
          'service_subcategory_id',
          'created_at',
        ])
        .withCount('reviews', (r) => {
          r.as('reviews_count')
        })
        .withAggregate('variants', (v) => {
          v.min('price').as('starting_from')
        })
        .limit(config.get('common.rowsPerPage') || 20)
    }

    return services
  }

  async createReview() {
    const { bouncer, auth, params, request } = this.ctx
    await bouncer.with(ReviewPolicy).authorize('create')

    const user = auth.user
    const serviceId = params.id

    const reviewExist = await Review.query()
      .where('user_id', user!.id)
      .where('service_id', serviceId)
      .first()

    if (reviewExist) {
      return 'Review Exit'
    }

    const payload = await request.validateUsing(CreateServiceReviewValidator)

    const review = await Review.create({ ...payload, userId: user?.id, serviceId: serviceId })
    return review
  }
}
