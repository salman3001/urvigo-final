import Activity from '#models/activity'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(Activity, ({ faker }) => {
  return {
    name: faker.lorem.lines(1),
  }
}).build()
