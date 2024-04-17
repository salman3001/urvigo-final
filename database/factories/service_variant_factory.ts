import { DiscountType } from '#helpers/enums'
import ServiceVariant from '#models/service_variant'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(ServiceVariant, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    price: faker.number.int({ min: 20, max: 100 }),
    discountFlat: 0,
    discountPercentage: 0,
    discountType: DiscountType.FLAT,
    desc: faker.lorem.lines(2),
  }
}).build()
