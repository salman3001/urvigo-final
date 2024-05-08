// import { userTypes } from '#helpers/enums'
// import User from '#models/user'
// import { createUser, truncateTables } from '#tests/helpers'
import { test } from '@japa/runner'

test.group('Api timeslots', () => {
  // let user: User | null = null
  // group.setup(async () => {
  //   user = await createUser(userTypes.VENDER)
  // })
  // group.teardown(async () => {
  //   await truncateTables(['timeslot_plans', 'users'])
  // })
  // test('create', async ({ client, route }) => {
  //   const response = await client
  //     .post(route('api.timeslot-plan.store'))
  //     .withGuard('web')
  //     .loginAs(user!)
  //     .form({
  //       name: 'plan 1',
  //       limitToOneBooking: true,
  //       options: [
  //         {
  //           week: WeekDays.MONDAY,
  //           from: '12:30',
  //           to: '13:30',
  //         },
  //       ],
  //     })
  //     .withCsrfToken()
  //   response.assertTextIncludes('Plan Created')
  // })
  // test('update', async ({ client, route }) => {
  //   const response = await client
  //     .put(route('api.timeslot-plan.update', [1]))
  //     .withGuard('web')
  //     .loginAs(user!)
  //     .form({
  //       name: 'plan 2',
  //       limitToOneBooking: true,
  //       options: [
  //         {
  //           week: WeekDays.MONDAY,
  //           from: '12:30',
  //           to: '13:30',
  //         },
  //       ],
  //     })
  //     .withCsrfToken()
  //   response.assertTextIncludes('Plan Updated')
  // })
  // test('list', async ({ client, route }) => {
  //   const response = await client
  //     .get(route('api.timeslot-plan.index'))
  //     .withGuard('web')
  //     .loginAs(user!)
  //     .withCsrfToken()
  //   response.assertTextIncludes('plan 2')
  // })
  // test('delete', async ({ client, route }) => {
  //   const response = await client
  //     .delete(route('api.timeslot-plan.destroy', [1]))
  //     .withGuard('web')
  //     .loginAs(user!)
  //     .withCsrfToken()
  //   response.assertTextIncludes('Plan Deleted')
  // })
})
