import BusinessProfile from '#models/business_profile'
import Factory from '@adonisjs/lucid/factories'
import { BigNumber } from 'bignumber.js'
import serviceFactory from './service_factory.js'

export default Factory.define(BusinessProfile, ({ faker }) => {
  return {
    businessName: faker.company.name(),
    avgRating: new BigNumber(0).toFixed(2),
    shortDesc: faker.lorem.lines(2),
    longDesc: faker.lorem.paragraph(),
  }
})
  .relation('services', () => serviceFactory)
  .build()
