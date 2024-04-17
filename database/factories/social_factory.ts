import Social from '#models/social'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(Social, ({ faker }) => {
  return {
    website: faker.internet.domainName(),
    facebook: faker.internet.domainName(),
    instagram: faker.internet.domainName(),
    telegram: faker.internet.userName(),
    twitter: faker.internet.userName(),
    vk: faker.internet.domainName(),
  }
}).build()
