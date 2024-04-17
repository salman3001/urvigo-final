import Faq from '#models/faq'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(Faq, ({ faker }) => {
  return {
    quest: faker.lorem.words(10),
    ans: faker.lorem.paragraph(),
  }
}).build()
