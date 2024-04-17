import Factory from '@adonisjs/lucid/factories'
import FaqFactory from './faqFactory.js'
import SeoFactory from './seoFactory.js'
import ServiceFactory from './serviceFactory.js'
import ServiceSubcategoryFactory from './serviceSubcategoryFactory.js'
import ServiceCategory from '#models/serviceCategory'

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
