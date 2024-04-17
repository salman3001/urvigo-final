import Factory from '@adonisjs/lucid/factories'
import KnowledgebaseContentFactory from './knowledgebase_content_factory.js'
import KnowledgeBaseCategory from '#models/knowledge_base_category'

export default Factory.define(KnowledgeBaseCategory, ({ faker }) => {
  return {
    name: faker.lorem.words(1),
    slug: faker.lorem.slug(5),
    metaTitle: faker.lorem.lines(1),
    metaDesc: faker.lorem.lines(1),
    metaKeywords: faker.lorem.words(5),
  }
})
  .relation('contents', () => KnowledgebaseContentFactory)
  .build()
