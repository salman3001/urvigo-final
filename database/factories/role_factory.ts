import Role from '#models/role'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(Role, ({ faker }) => {
  return {
    name: faker.lorem.word(),
    permissions: [],
  }
}).build()
