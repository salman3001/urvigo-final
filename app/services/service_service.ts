import Review from '#models/review'
import Service from '#models/service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import config from '@adonisjs/core/services/config'
import {
  CreateServiceReviewValidator,
  createServiceValidator,
  updateServiceValidator,
} from '#validators/service'
import ReviewPolicy from '#policies/review_policy'
import { IndexOption } from '../helpers/types.js'
import { paginate, slugify } from '../helpers/common.js'
import db from '@adonisjs/lucid/services/db'
import ServiceVariant from '../models/service_variant.js'
import FileService from './file_service.js'
import Image from '../models/image.js'
import User from '#models/user'
import TimeslotPlan from '#models/timeslot_plan'

@inject()
export default class ServiceService {
  constructor(
    protected ctx: HttpContext,
    protected fileService: FileService
  ) {}

  async index(opt?: IndexOption) {
    const { bouncer, request } = this.ctx
    await bouncer.with('ServicePolicy').authorize('viewList')

    const serviceQuery = Service.query()
      .where('is_active', true)
      .preload('serviceCategory', (s) => {
        s.select(['name'])
      })
      .preload('serviceSubcategory', (s) => {
        s.select(['id', 'name'])
      })
      .preload('tags', (s) => {
        s.select(['id', 'name'])
      })
      .preload('variants')
      .select([
        'id',
        'name',
        'slug',
        'short_desc',
        'is_active',
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

    !opt?.disableFilter && serviceQuery.filter(request.qs())

    return await serviceQuery.paginate(
      request.qs()?.page || 1,
      request.qs()?.perPage || config.get('common.rowsPerPage')
    )
  }

  async myList(opt?: IndexOption) {
    const { request, bouncer, auth } = this.ctx
    // @ts-ignore
    await bouncer.with('ServicePolicy').authorize('myList')
    const vendor = auth.user as User
    await vendor.load('businessProfile')

    const serviceQuery = Service.query()
      .where('business_profile_id', vendor.businessProfile.id)
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
      .preload('images')
      .select([
        'id',
        'name',
        'slug',
        'short_desc',
        'is_active',
        'thumbnail',
        'avg_rating',
        'business_profile_id',
        'service_category_id',
        'service_subcategory_id',
        'created_at',
      ])
      .orderBy('created_at', 'desc')

    !opt?.disableFilter && serviceQuery.filter(request.qs())
    const services = await paginate(serviceQuery, request)

    return services
  }

  async myAllList() {
    const { bouncer, auth } = this.ctx
    // @ts-ignore
    await bouncer.with('ServicePolicy').authorize('myList')
    const vendor = auth.user as User
    await vendor.load('businessProfile')

    const serviceQuery = Service.query()
      .where('business_profile_id', vendor.businessProfile.id)
      .select(['id', 'name'])
    const services = await serviceQuery.exec()

    return services
  }

  async showBySlug() {
    const { bouncer, params } = this.ctx
    await bouncer.with('ServicePolicy').authorize('view')

    const slug = params.slug
    const serviceQuery = Service.query()
      .where('slug', slug)
      .preload('variants')
      .preload('businessProfile', (v) => {
        v.preload('vendor')
      })
      .preload('timeSlotPlan')
      .preload('serviceCategory')
      .preload('serviceSubcategory')
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

  async showBySlugActiveOnly() {
    const { bouncer, params } = this.ctx
    await bouncer.with('ServicePolicy').authorize('view')

    const slug = params.slug
    const serviceQuery = Service.query()
      .where('is_active', true)
      .where('slug', slug)
      .preload('variants')
      .preload('timeSlotPlan')
      .preload('businessProfile', (v) => {
        v.preload('vendor')
      })
      .preload('serviceCategory')
      .preload('serviceSubcategory')
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
        .where('is_active', true)
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

  async vendorServices() {
    const { bouncer, params, request } = this.ctx
    await bouncer.with('ServicePolicy').authorize('viewList')

    const vendor = await User.query()
      .where('id', params.id)
      .preload('businessProfile', (b) => {
        b.select('id')
      })
      .firstOrFail()

    let services: Service[] = []

    if (vendor) {
      const serviceQuery = Service.query()
        .whereHas('businessProfile', (s) => {
          s.where('id', vendor?.businessProfile?.id)
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

      services = await paginate(serviceQuery, request)
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

  async store() {
    const { request, bouncer, auth } = this.ctx
    // @ts-ignore
    await bouncer.with('ServicePolicy').authorize('create')

    const user = auth.user!
    await user.load('businessProfile')

    const payload = await request.validateUsing(createServiceValidator)
    const slug = slugify(payload.service.name)

    let service: Service | null = null

    await db.transaction(async (trx) => {
      service = await Service.create(
        { ...payload.service, businessProfileId: user.businessProfile.id, slug: slug },
        { client: trx }
      )

      if (payload.variant) {
        for (const [index, variantPayload] of payload.variant.entries()) {
          const variant = await ServiceVariant.create(
            { ...variantPayload, serviceId: service.id },
            { client: trx }
          )

          if (payload?.variantImages?.[index]) {
            variant.image = await this.fileService.uploadeImage(
              // @ts-ignore
              payload?.variantImages?.[index],
              'services/variants'
            )
          }

          await variant.save()
        }
      }

      if (payload.timeSlotPlanId) {
        const timslotPlan = await TimeslotPlan.findOrFail(payload.timeSlotPlanId, { client: trx })
        await service.related('timeSlotPlan').save(timslotPlan)
      }

      if (payload.seo) {
        await service.related('seo').create(payload.seo)
      }

      if (payload.tags) {
        await service.related('tags').attach(payload.tags)
      }

      if (payload.faq) {
        await service.related('faq').createMany(payload.faq)
      }

      if (payload.thumbnail) {
        service.thumbnail = await this.fileService.uploadeImage(
          payload.thumbnail,
          'services/thumbnails'
        )
      }

      if (payload.images) {
        for (const img of payload.images) {
          if (img) {
            await service
              .related('images')
              .create({ file: await this.fileService.uploadeImage(img, 'services/images') })
          }
        }
      }

      if (payload.video) {
        service.video = { url: await this.fileService.uploadeFile(payload.video) }
      }

      await service.save()
    })

    return service!
  }

  async update() {
    const { request, params, bouncer } = this.ctx
    const service = await Service.findOrFail(+params.id)
    const payload = await request.validateUsing(updateServiceValidator, {
      meta: {
        serviceId: service.id,
      },
    })

    await db.transaction(async (trx) => {
      await bouncer.with('ServicePolicy').authorize('update', service)
      service.useTransaction(trx)
      if (payload.service) {
        if (payload.service?.name) {
          const slug = slugify(payload.service.name)
          service.merge({ ...payload.service, slug })
          await service.save()
        } else {
          service.merge(payload.service)
          await service.save()
        }
      }

      if (payload.variant) {
        await service.load('variants')

        if (service.variants) {
          for (const v of service.variants) {
            await v.delete()
          }
        }

        for (const [index, variantPayload] of payload.variant.entries()) {
          const variant = await ServiceVariant.create(
            { ...variantPayload, serviceId: service.id },
            { client: trx }
          )

          if (payload.variantImages?.[index]) {
            variant.image = await this.fileService.uploadeImage(
              payload.variantImages?.[index]!,
              'services/variants'
            )
          }
          await variant.save()
        }
      }

      if (payload.timeSlotPlanId) {
        const timslotPlan = await TimeslotPlan.findOrFail(payload.timeSlotPlanId, { client: trx })
        await service.related('timeSlotPlan').save(timslotPlan)
      }

      if (payload.seo) {
        await service.load('seo')
        if (service.seo) {
          service.seo.merge(payload.seo)
          await service.seo.save()
        } else {
          await service.related('seo').create(payload.seo)
        }
      }

      if (payload.tags) {
        await service.related('tags').detach()
        await service.related('tags').attach(payload.tags)
      }

      if (payload.faq) {
        await service.load('faq')
        if (service.faq) {
          for (const f of service.faq) {
            await f.delete()
          }
        }
        await service.related('faq').createMany(payload.faq)
      }

      if (payload.thumbnail) {
        service.thumbnail = await this.fileService.uploadeImage(
          payload.thumbnail,
          'services/thumbnails'
        )
      }

      if (payload.images) {
        // for (const img of service.images) {
        //   await img.delete()

        // }

        for (const img of payload.images) {
          await service.related('images').create({
            file: await this.fileService.uploadeImage(img, 'services/images'),
            serviceId: service.id,
          })
        }
      }

      if (payload.video) {
        if (service.video) {
          service.video = {
            url: await this.fileService.uploadeFile(payload.video, 'services/videos'),
          }
        }
      }

      await service.save()
    })

    return service
  }

  async destroy() {
    const { params, bouncer } = this.ctx
    const service = await Service.findOrFail(+params.id)
    await bouncer.with('ServicePolicy').authorize('delete', service)
    await service.delete()

    return service
  }

  async deleteImages() {
    const { params, bouncer } = this.ctx
    const service = await Service.findOrFail(+params.id)
    await bouncer.with('ServicePolicy').authorize('update', service)
    const image = await Image.findOrFail(+params.imageId)
    await image.delete()
    return image
  }
}
