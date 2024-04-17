import { DiscountType } from '#helpers/enums'
import ServiceVariant from '#models/serviceVariant'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(ServiceVariant, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    price: faker.number.int({ min: 20, max: 100 }),
    excluded: JSON.parse(faker.datatype.json()),
    included: JSON.parse(faker.datatype.json()),
    discountFlat: 0,
    discountPercentage: 0,
    discountType: DiscountType.FLAT,
    features: JSON.parse(faker.datatype.json()),
    // aditionalProperties: [
    //   { color: 'pink', size: '32' },
    //   { color: 'black', size: '34' },
    // ],
  }
}).build()
