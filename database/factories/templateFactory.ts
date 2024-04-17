import Template from '#models/template'
import Factory from '@adonisjs/lucid/factories'
import campaignFactory from './campaignFactory.js'

export default Factory.define(Template, ({ faker }) => {
  return {
    name: faker.lorem.word(8),
    desc: faker.lorem.paragraph(),
    content: faker.lorem.paragraphs(),
  }
})
  .relation('campaign', () => campaignFactory)
  .build()
