import Factory from '@adonisjs/lucid/factories'
import FaqFactory from './faq_factory.js'
import SeoFactory from './seo_factory.js'
import ServiceSubcategory from '#models/service_subcategory'
import serviceCategoryFactory from './service_category_factory.js'
import serviceFactory from './service_factory.js'

export default Factory.define(ServiceSubcategory, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    slug: faker.lorem.slug(),
    shortDesc: faker.lorem.paragraph(),
    longDesc: faker.lorem.paragraphs(),
    status: false,
  }
})
  .relation('faqs', () => FaqFactory)
  .relation('serviceCategory', () => serviceCategoryFactory)
  .relation('services', () => serviceFactory)
  .relation('seo', () => SeoFactory)
  .build()
