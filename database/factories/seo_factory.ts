import Seo from '#models/seo'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(Seo, ({ faker }) => {
  return {
    metaTitle: faker.lorem.words(3),
    metaKeywords: faker.lorem.words(5),
    metaDesc: faker.lorem.words(10),
  }
}).build()
