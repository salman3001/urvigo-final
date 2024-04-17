import User from '#models/user'
import Factory from '@adonisjs/lucid/factories'
import businessProfileFactory from './business_profile_factory.js'
import { UserProfileFactory } from './user_profile_factory.js'
import RoleFactory from './role_factory.js'

export default Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    isActive: false,
    password: '123456789',
    phone: '9999999999',
  }
})
  .relation('role', () => RoleFactory)
  .relation('profile', () => UserProfileFactory)
  .relation('businessProfile', () => businessProfileFactory)
  .build()
