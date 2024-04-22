import ServiceTag from '#models/service_tag'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import FileService from './file_service.js'
import {
  createServiceCategoryValidator,
  updateServiceCategoryValidator,
} from '../validators/service.js'
import { slugify } from '../helpers/common.js'

@inject()
export default class ServiceTagService {
  constructor(
    protected ctx: HttpContext,
    protected fileService: FileService
  ) {}

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

  async store() {
    const { request, bouncer } = this.ctx
    await bouncer.with('ServiceCategoryPolicy').authorize('create')
    const payload = await request.validateUsing(createServiceCategoryValidator)
    const slug = slugify(payload.category.name)
    const category = await ServiceTag.create({ ...payload.category, slug })

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

    const category = await ServiceTag.findOrFail(+params.id)

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
    const category = await ServiceTag.findOrFail(+params.id)

    await bouncer.with('ServiceCategoryPolicy').authorize('delete')

    await category.delete()

    return 'Deleted'
  }
}
