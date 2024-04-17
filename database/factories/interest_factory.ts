import Factory from '@adonisjs/lucid/factories'
import SubscriberFactory from './subscriber_factory.js'
import Interest from '#models/interest'
import campaignFactory from './campaign_factory.js'

export default Factory.define(Interest, ({ faker }) => {
  return {
    name: faker.lorem.word(6),
  }
})
  .relation('campaigns', () => campaignFactory)
  .relation('subscribers', () => SubscriberFactory)
  .build()
