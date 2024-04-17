import Factory from '@adonisjs/lucid/factories'
import FaqFactory from './faqFactory.js'
import ServiceSubcategoryFactory from './serviceSubcategoryFactory.js'
import SeoFactory from './seoFactory.js'
import ServiceTagFactory from './serviceTagFactory.js'
import ServiceVariantFactory from './serviceVariantFactory.js'
import VendorUserFactory from './vendorUserFactory.js'
import Service from '#models/service'
import serviceCategoryFactory from './serviceCategoryFactory.js'

export default Factory.define(Service, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    slug: faker.lorem.slug(),
    shortDesc: faker.commerce.productDescription(),
    longDesc: faker.lorem.paragraphs(),
    isActive: false,
    locationSpecific: false,
    geoLocation: `${faker.location.longitude()},${faker.location.latitude()}`,
  }
})
  .relation('faq', () => FaqFactory)
  .relation('serviceCategory', () => serviceCategoryFactory)
  .relation('serviceSubcategory', () => ServiceSubcategoryFactory)
  .relation('seo', () => SeoFactory)
  .relation('tags', () => ServiceTagFactory)
  .relation('variants', () => ServiceVariantFactory)
  .build()
