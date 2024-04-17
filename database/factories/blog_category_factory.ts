import BlogCategory from '#models/blog_category'
import Factory from '@adonisjs/lucid/factories'
import BlogFactory from './blog_factory.js'

export default Factory.define(BlogCategory, ({ faker }) => {
  return {
    name: faker.lorem.word(),
    slug: faker.lorem.slug(5),
    metaTitle: faker.lorem.lines(1),
    metaDesc: faker.lorem.lines(1),
    metaKeywords: faker.lorem.words(5),
  }
})
  .relation('blogs', () => BlogFactory)
  .build()
