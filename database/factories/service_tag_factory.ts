import Factory from '@adonisjs/lucid/factories'
import FaqFactory from './faq_factory.js'
import SeoFactory from './seo_factory.js'
import ServiceTag from '#models/service_tag'

export default Factory.define(ServiceTag, ({ faker }) => {
  return {
    name: faker.lorem.word(),
    slug: faker.lorem.slug(),
    shortDesc: faker.commerce.productDescription(),
    longDesc: faker.lorem.paragraphs(),
  }
})
  .relation('faqs', () => FaqFactory)
  .relation('seo', () => SeoFactory)
  .build()
