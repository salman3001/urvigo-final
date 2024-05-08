import { WeekDays, userTypes } from '#helpers/enums'
import User from '#models/user'
import { createUser } from '#tests/helpers'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

test.group('Web vendor time slots', (group) => {
  let user: User | null = null

  group.setup(async () => {
    user = await createUser(userTypes.VENDER)
  })

  group.teardown(async () => {
    await db.rawQuery('TRUNCATE TABLE timeslot_plans RESTART IDENTITY CASCADE')
    await db.rawQuery('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
  })

  test('create', async ({ client, route }) => {
    const response = await client
      .post(route('vendor.timeslot-plans.create'))
      .withInertia()
      .withGuard('web')
      .loginAs(user!)
      .form({
        name: 'plan 1',
        limitToOneBooking: true,
        options: [
          {
            week: WeekDays.MONDAY,
            from: '12:30',
            to: '13:30',
          },
        ],
      })
      .withCsrfToken()
    response.assertTextIncludes('Timeslot Created')
  })

  test('update', async ({ client, route }) => {
    const response = await client
      .put(route('vendor.timeslot-plans.update', [1]))
      .withInertia()
      .withGuard('web')
      .loginAs(user!)
      .form({
        name: 'plan 2',
        limitToOneBooking: true,
        options: [
          {
            week: WeekDays.MONDAY,
            from: '12:30',
            to: '13:30',
          },
        ],
      })
      .withCsrfToken()

    response.assertTextIncludes('Timeslot Updated')
  })

  test('list', async ({ client, route }) => {
    const response = await client
      .get(route('vendor.timeslot-plans.index'))
      .withInertia()
      .withGuard('web')
      .loginAs(user!)
      .withCsrfToken()

    response.assertTextIncludes('plan 2')
  })

  test('delete', async ({ client, route }) => {
    const response = await client
      .delete(route('vendor.timeslot-plans.destroy', [1]))
      .withInertia()
      .withGuard('web')
      .loginAs(user!)
      .withCsrfToken()

    response.assertTextIncludes('Timeslot Deleted')
  })
})
