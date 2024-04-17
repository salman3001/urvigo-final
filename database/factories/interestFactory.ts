import Factory from '@adonisjs/lucid/factories'
import SubscriberFactory from './subscriberFactory.js'
import Interest from '#models/interest'
import campaignFactory from './campaignFactory.js'

export default Factory.define(Interest, ({ faker }) => {
  return {
    name: faker.lorem.word(6),
  }
})
  .relation('campaigns', () => campaignFactory)
  .relation('subscribers', () => SubscriberFactory)
  .build()
