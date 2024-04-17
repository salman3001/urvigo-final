import factory from '@adonisjs/lucid/factories'
import UserProfile from '#models/user_profile'

export const UserProfileFactory = factory
  .define(UserProfile, async ({ faker }) => {
    return {}
  })
  .build()
