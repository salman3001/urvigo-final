import KnowledgeBaseContent from '#models/knowledge_base_content'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(KnowledgeBaseContent, ({ faker }) => {
  return {
    title: faker.lorem.words(5),
    slug: faker.lorem.slug(5),
    metaTitle: faker.lorem.words(5),
    metaDesc: faker.lorem.words(5),
    metaKeywords: faker.lorem.words(5),
  }
}).build()
