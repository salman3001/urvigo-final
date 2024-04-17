import Subscriber from '#models/subscriber'
import Factory from '@adonisjs/lucid/factories'
import interestFactory from './interestFactory.js'

export default Factory.define(Subscriber, ({ faker }) => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.number.int({ max: 999999999, min: 111111111 }).toString(),
    status: false,
  }
})
  .relation('interests', () => interestFactory)
  .build()
