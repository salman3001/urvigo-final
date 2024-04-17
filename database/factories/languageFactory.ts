import Language from '#models/language'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(Language, ({ faker }) => {
  return {
    name: faker.location.country(),
  }
}).build()
