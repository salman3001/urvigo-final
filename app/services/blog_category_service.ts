import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import BlogCategory from '../models/blog_category.js'
import { createBlogCategoryValidator, updateBlogCategoryValidator } from '../validators/blog.js'
import { slugify } from '../helpers/common.js'
import { IndexOption } from '../helpers/types.js'

@inject()
export default class BlogCategoryService {
  constructor(protected ctx: HttpContext) {}

  async index(opt?: IndexOption) {
    const { bouncer, request } = this.ctx
    await bouncer.with('BlogPolicy').authorize('viewList')
    const blogQuery = BlogCategory.query()

    !opt?.disableFilter && blogQuery.filter(request.qs())
    const categories = await blogQuery.exec()

    return categories
  }

  async show() {
    const { bouncer, params } = this.ctx
    await bouncer.with('BlogPolicy').authorize('view')

    const id = params.id
    const category = await BlogCategory.query().where('id', id).firstOrFail()

    return category
  }

  async store() {
    const { request, bouncer } = this.ctx
    await bouncer.with('BlogPolicy').authorize('create')
    const { slug, ...payload } = await request.validateUsing(createBlogCategoryValidator)

    let category: BlogCategory | null = null

    if (slug) {
      category = await BlogCategory.create({ ...payload, slug })
    } else {
      category = await BlogCategory.create({ slug: slugify(payload.name), ...payload })
    }

    return category
  }

  async update() {
    const { request, params, bouncer } = this.ctx
    await bouncer.with('BlogPolicy').authorize('update')
    const category = await BlogCategory.findOrFail(+params.id)
    const { slug, ...payload } = await request.validateUsing(updateBlogCategoryValidator, {
      meta: {
        categoryId: category.id,
      },
    })

    if (slug) {
      category.merge({ ...payload, slug })
    }

    await category.save()

    return category
  }

  async destroy() {
    const { params, bouncer } = this.ctx
    await bouncer.with('BlogPolicy').authorize('delete')
    const category = await BlogCategory.findOrFail(+params.id)
    await category.delete()
    return category
  }
}
