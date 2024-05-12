import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import KnowledgeBaseCategory from '#models/knowledge_base_category'
import KnowledgeBaseContent from '#models/knowledge_base_content'

@inject()
export default class HelpcenterService {
  constructor(protected ctx: HttpContext) {}

  async helpcenterIndexPageData() {
    const { bouncer, request } = this.ctx
    const search = request.qs().search
    const searchString = `%${search}%`
    await bouncer.with('KnowledgebasePolicy').authorize('viewList')
    const catgoriesQuery = KnowledgeBaseCategory.query().preload('contents', (c) => {
      c.select(['id', 'title', 'slug', 'short_desc', 'knowledge_base_category_id']).where(
        'is_active',
        true
      )

      if (search) {
        c.whereILike('title', searchString)
      }
    })

    const featuredContentQeury = KnowledgeBaseContent.query()
      .where('featured', true)
      .where('is_active', true)
      .select(['id', 'title', 'slug', 'short_desc', 'knowledge_base_category_id'])

    if (search) {
      catgoriesQuery.whereHas('contents', (c) => {
        c.whereILike('title', searchString)
      })

      featuredContentQeury.whereILike('title', search)
    }

    const catgories = await catgoriesQuery.exec()
    const featuredContent = await featuredContentQeury.limit(6).exec()

    return {
      catgories,
      featuredContent: featuredContent,
    }
  }

  async helpcenterDetailPageData() {
    const { bouncer, params } = this.ctx
    await bouncer.with('KnowledgebasePolicy').authorize('view')
    const slug = params.slug
    const content = await KnowledgeBaseContent.findByOrFail('slug', slug)
    const similarContent = await KnowledgeBaseContent.query()
      .where('knowledge_base_category_id', content.knowledgeBaseCategoryId)
      .whereNot('id', content.id)
      .exec()

    return { content, similarContent }
  }
}
