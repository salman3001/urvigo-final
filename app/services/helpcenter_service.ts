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
    await bouncer.with('KnowledgebasePolicy').authorize('viewList')
    const catgoriesQuery = KnowledgeBaseCategory.query().preload('contents', (c) => {
      c.select(['id', 'title', 'slug', 'short_desc', 'knowledge_base_category_id']).where(
        'is_active',
        true
      )
    })

    if (search) {
      catgoriesQuery.whereHas('contents', (c) => {
        const searchString = `%${search}%`
        c.whereILike('title', searchString)
      })
    }

    const catgories = await catgoriesQuery.exec()

    const featuredContent = await KnowledgeBaseContent.query()
      .where('featured', true)
      .limit(6)
      .exec()

    return {
      catgories,
      featuredContent,
    }
  }

  async helpcenterDetailPageData() {
    const { bouncer, params } = this.ctx
    await bouncer.with('KnowledgebasePolicy').authorize('view')
    const slug = params.slug
    const content = await KnowledgeBaseContent.findByOrFail('slug', slug)

    return content
  }
}
