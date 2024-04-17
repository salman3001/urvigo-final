import Factory from '@adonisjs/lucid/factories'
import FaqFactory from './faq_factory.js'
import SeoFactory from './seo_factory.js'
import ServiceFactory from './service_factory.js'
import ServiceSubcategoryFactory from './service_subcategory_factory.js'
import ServiceCategory from '#models/service_category'

export default Factory.define(ServiceCategory, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    slug: faker.lorem.slug(),
    shortDesc: faker.lorem.paragraph(),
    longDesc: faker.lorem.paragraphs(),
    status: false,
  }
})
  .relation('faqs', () => FaqFactory)
  .relation('seo', () => SeoFactory)
  .relation('services', () => ServiceFactory)
  .relation('subCategory', () => ServiceSubcategoryFactory)
  .build()
