import BusinessProfile from '#models/businessProfile'
import Factory from '@adonisjs/lucid/factories'
import { BigNumber } from 'bignumber.js'
import serviceFactory from './serviceFactory.js'

export default Factory.define(BusinessProfile, ({ faker }) => {
  return {
    businessName: faker.company.name(),
    avgRating: new BigNumber(0).toFixed(2)
  }
})
  .relation('services', () => serviceFactory)
  .build()
