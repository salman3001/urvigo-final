import ContactMessage from '#models/contactMessage'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(ContactMessage, ({ faker }) => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    title: faker.lorem.lines(1),
    message: faker.lorem.sentence(),
  }
}).build()
