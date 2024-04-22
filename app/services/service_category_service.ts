import ServiceCategory from '#models/service_category'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { slugify } from '../helpers/common.js'
import {
  createServiceCategoryValidator,
  updateServiceCategoryValidator,
} from '../validators/service.js'
import FileService from './file_service.js'

@inject()
export default class ServiceCategoryService {
  constructor(
    protected ctx: HttpContext,
    protected fileService: FileService
  ) {}

  async index() {
    const { bouncer } = this.ctx
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

  async store() {
    const { request, bouncer } = this.ctx
    await bouncer.with('ServiceCategoryPolicy').authorize('create')
    const payload = await request.validateUsing(createServiceCategoryValidator)
    const slug = slugify(payload.category.name)
    const category = await ServiceCategory.create({ ...payload.category, slug })

    if (payload.seo) {
      await category.related('seo').create(payload.seo)
    }

    if (payload.faq) {
      await category.related('faqs').createMany(payload.faq)
    }

    if (payload.image) {
      category.thumbnail = await this.fileService.uploadeImage(payload.image)
    }

    await category.save()
    return category
  }

  async update() {
    const { request, params, bouncer } = this.ctx
    await bouncer.with('ServiceCategoryPolicy').authorize('update')

    const category = await ServiceCategory.findOrFail(+params.id)

    const payload = await request.validateUsing(updateServiceCategoryValidator, {
      meta: {
        serviceCategoryId: category.id,
      },
    })

    if (payload.category) {
      if (payload?.category?.name) {
        const slug = slugify(payload?.category.name)
        category.merge({ ...payload.category, slug })
        await category.save()
      } else {
        category.merge(payload.category)
        await category.save()
      }
    }

    if (payload.seo) {
      await category.load('seo')
      if (category.seo) {
        category.seo.merge(payload.seo)
        await category.seo.save()
      } else {
        await category.related('seo').create(payload.seo)
      }
    }

    if (payload.faq) {
      await category.load('faqs')
      if (category.faqs) {
        for (const f of category.faqs) {
          await f.delete()
        }
      }
      await category.related('faqs').createMany(payload.faq)
    }

    if (payload.image) {
      category.thumbnail = await this.fileService.uploadeImage(payload.image)
    }
    await category.save()

    return category
  }

  async destroy(): Promise<'Deleted'> {
    const { params, bouncer } = this.ctx
    const category = await ServiceCategory.findOrFail(+params.id)

    await bouncer.with('ServiceCategoryPolicy').authorize('delete')

    await category.delete()

    return 'Deleted'
  }
}
