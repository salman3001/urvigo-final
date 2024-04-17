import CampaignType from '#models/campaignType'
import Factory from '@adonisjs/lucid/factories'
import campaignFactory from './campaignFactory.js'

export default Factory.define(CampaignType, ({ faker }) => {
  return {
    name: faker.lorem.word(6),
  }
})
  .relation('campaign', () => campaignFactory)
  .build()
