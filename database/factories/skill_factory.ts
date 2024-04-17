import Skill from '#models/skill'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(Skill, ({ faker }) => {
  return {
    name: faker.lorem.word(),
  }
}).build()
