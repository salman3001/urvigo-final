import { userTypes } from '#helpers/enums'
import User from '#models/user'
import { createUser, truncateTables } from '#tests/helpers/common'
import { timeslotPayload } from '#tests/helpers/payloads'
import { test } from '@japa/runner'

test.group('Web vendor time slots', (group) => {
  let user: User | null = null

  group.setup(async () => {
    user = await createUser(userTypes.VENDER)
  })

  group.each.teardown(async () => {
    await truncateTables(['timeslot_plans'])
  })

  group.teardown(async () => {
    await truncateTables(['timeslot_plans', 'users'])
  })

  test('create', async ({ client, route }) => {
    const response = await client
      .post(route('vendor.timeslot-plans.create'))
      .withGuard('web')
      .loginAs(user!)
      .form({
        ...timeslotPayload,
      })
      .withCsrfToken()
      .withInertia()
    response.assertTextIncludes('Timeslot Created')
  })

  test('update', async ({ client, route }) => {
    await client
      .post(route('vendor.timeslot-plans.create'))
      .withGuard('web')
      .loginAs(user!)
      .form({
        ...timeslotPayload,
      })
      .withCsrfToken()
      .withInertia()

    const response = await client
      .put(route('vendor.timeslot-plans.update', [1]))
      .withGuard('web')
      .loginAs(user!)
      .form({
        ...timeslotPayload,
        name: 'plan 2',
      })
      .withCsrfToken()
      .withInertia()

    response.dumpBody()

    response.assertTextIncludes('Timeslot Updated')
  })

  test('list', async ({ client, route }) => {
    await client
      .post(route('vendor.timeslot-plans.create'))
      .withGuard('web')
      .loginAs(user!)
      .form({
        ...timeslotPayload,
      })
      .withCsrfToken()
      .withInertia()

    const response = await client
      .get(route('vendor.timeslot-plans.index'))
      .withGuard('web')
      .loginAs(user!)
      .withCsrfToken()
      .withInertia()

    response.assertTextIncludes('plan 1')
  })

  test('delete', async ({ client, route }) => {
    await client
      .post(route('vendor.timeslot-plans.create'))
      .withGuard('web')
      .loginAs(user!)
      .form({
        ...timeslotPayload,
      })
      .withCsrfToken()
      .withInertia()
    const response = await client
      .delete(route('vendor.timeslot-plans.destroy', [1]))
      .withGuard('web')
      .loginAs(user!)
      .withCsrfToken()
      .withInertia()

    response.assertTextIncludes('Timeslot Deleted')
  })
})
