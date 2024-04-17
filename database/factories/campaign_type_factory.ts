import CampaignType from '#models/campaign_type'
import Factory from '@adonisjs/lucid/factories'
import campaignFactory from './campaign_factory.js'

export default Factory.define(CampaignType, ({ faker }) => {
  return {
    name: faker.lorem.word(6),
  }
})
  .relation('campaign', () => campaignFactory)
  .build()
