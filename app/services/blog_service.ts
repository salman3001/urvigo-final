import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { paginate, slugify } from '../helpers/common.js'
import Blog from '../models/blog.js'
import { createBlogValidator, updateBlogValidator } from '../validators/blog.js'
import FileService from './file_service.js'
import { IndexOption } from '../helpers/types.js'

@inject()
export default class BlogService {
  constructor(
    protected ctx: HttpContext,
    protected fileService: FileService
  ) {}

  async index(opt?: IndexOption) {
    const { request, bouncer } = this.ctx
    await bouncer.with('BlogPolicy').authorize('viewList')
    const blogQuery = Blog.query()

    !opt?.disableFilter && blogQuery.filter(request.qs())
    const blogs = await paginate(blogQuery, request)

    return blogs
  }

  async show() {
    const { bouncer, params } = this.ctx
    await bouncer.with('BlogPolicy').authorize('view')

    const id = params.id
    const blog = await Blog.query().where('id', id).firstOrFail()

    return blog
  }

  async store() {
    const { request, bouncer } = this.ctx
    await bouncer.with('BlogPolicy').authorize('create')
    const { image, blogCategoryId, slug, ...payload } =
      await request.validateUsing(createBlogValidator)

    let blog: null | Blog = null

    if (slug) {
      blog = await Blog.create({ ...payload, slug })
    } else {
      blog = await Blog.create({ slug: slugify(payload.title), ...payload })
    }

    if (blogCategoryId) {
      blog.related('category').attach([blogCategoryId])
    }

    if (image) {
      const uploadedImage = await this.fileService.uploadeImage(image)
      blog.thumbnail = uploadedImage
    }

    await blog.save()
    return blog
  }

  async update() {
    const { request, params, bouncer } = this.ctx
    await bouncer.with('BlogPolicy').authorize('update')

    const blog = await Blog.findOrFail(+params.id)

    const { image, blogCategoryId, slug, ...payload } =
      await request.validateUsing(updateBlogValidator)

    if (slug) {
      blog.merge({ ...payload, slug })
      await blog.save()
    }

    if (blogCategoryId) {
      await blog.related('category').detach()
      await blog.related('category').attach([blogCategoryId])
    }

    if (image) {
      if (blog.thumbnail) {
        await this.fileService.deleteImage(blog.thumbnail)
      }
      blog.thumbnail = await this.fileService.uploadeImage(image)
    }

    await blog.save()
    return blog
  }

  async destroy() {
    const { params, bouncer } = this.ctx
    const blog = await Blog.findOrFail(+params.id)

    await bouncer.with('BlogPolicy').authorize('delete')

    await blog.delete()

    return blog
  }
}
