import Factory from '@adonisjs/lucid/factories'
import FaqFactory from './faqFactory.js'
import SeoFactory from './seoFactory.js'
import ServiceTag from '#models/serviceTag'

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
