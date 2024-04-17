import Factory from '@adonisjs/lucid/factories'
import FaqFactory from './faqFactory.js'
import SeoFactory from './seoFactory.js'
import ServiceSubcategory from '#models/serviceSubcategory'
import serviceCategoryFactory from './serviceCategoryFactory.js'
import serviceFactory from './serviceFactory.js'

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
