import Factory from '@adonisjs/lucid/factories'
import FaqFactory from './faq_factory.js'
import ServiceSubcategoryFactory from './service_subcategory_factory.js'
import SeoFactory from './seo_factory.js'
import ServiceTagFactory from './service_tag_factory.js'
import ServiceVariantFactory from './service_variant_factory.js'
import Service from '#models/service'
import serviceCategoryFactory from './service_category_factory.js'
import { DeliveryOptions } from '#helpers/enums'

export default Factory.define(Service, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    slug: faker.lorem.slug(),
    shortDesc: faker.commerce.productDescription(),
    longDesc: faker.lorem.paragraphs(),
    isActive: true,
    deliveryOptions: DeliveryOptions.BOTH,
  }
})
  .relation('faq', () => FaqFactory)
  .relation('serviceCategory', () => serviceCategoryFactory)
  .relation('serviceSubcategory', () => ServiceSubcategoryFactory)
  .relation('seo', () => SeoFactory)
  .relation('tags', () => ServiceTagFactory)
  .relation('variants', () => ServiceVariantFactory)
  .build()
