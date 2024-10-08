import Campaign from '#models/campaign'
import Factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'
import InterestFactory from './interest_factory.js'
import TemplateFactory from './template_factory.js'

export default Factory.define(Campaign, ({ faker }) => {
  return {
    name: faker.lorem.word(),
    subject: faker.lorem.lines(1),
    fromName: faker.internet.userName(),
    fromEmail: faker.internet.email(),
    replyTo: faker.internet.email(),
    status: false,
    deliveryDateTime: DateTime.now(),
  }
})
  .relation('interests', () => InterestFactory)
  .relation('template', () => TemplateFactory)
  .build()
