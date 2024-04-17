import Review from '#models/review'
import Factory from '@adonisjs/lucid/factories'

export default Factory.define(Review, ({ faker }) => {
  return {
    message: faker.lorem.lines(2),
    rating: 4,
  }
}).build()
