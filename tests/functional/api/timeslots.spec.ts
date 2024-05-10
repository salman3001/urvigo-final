import { userTypes } from '#helpers/enums'
import BusinessProfile from '#models/business_profile'
import User from '#models/user'
import { createUser, truncateTables } from '#tests/helpers/common'
import { createBookingPayload, servicePayload, timeslotPayload } from '#tests/helpers/payloads'
import { test } from '@japa/runner'
import { DateTime } from 'luxon'

test.group('Api timeslots', (group) => {
  let vendorUser: User | null = null
  let customerUser: User | null = null
  group.setup(async () => {
    vendorUser = await createUser(userTypes.VENDER)
    await BusinessProfile.create({
      businessName: 'business',
      userId: 1,
    })
    customerUser = await createUser(userTypes.USER)
  })
  group.each.teardown(async () => {
    await truncateTables(['timeslot_plans', 'services'])
  })

  group.teardown(async () => {
    await truncateTables(['timeslot_plans', 'users', 'business_profiles', 'services'])
  })
  test('create', async ({ client, route }) => {
    const response = await client
      .post(route('api.timeslot_plan.store'))
      .withGuard('web')
      .loginAs(vendorUser!)
      .form({
        ...timeslotPayload,
      })
      .withCsrfToken()
    response.assertTextIncludes('Plan Created')
  })
  test('update', async ({ client, route }) => {
    await client
      .post(route('api.timeslot_plan.store'))
      .withGuard('web')
      .loginAs(vendorUser!)
      .form({
        ...timeslotPayload,
      })
      .withCsrfToken()

    const response = await client
      .put(route('api.timeslot_plan.update', [1]))
      .withGuard('web')
      .loginAs(vendorUser!)
      .form({
        ...timeslotPayload,
      })
      .withCsrfToken()

    response.assertTextIncludes('Plan Updated')
  })
  test('list', async ({ client, route }) => {
    await client
      .post(route('api.timeslot_plan.store'))
      .withGuard('web')
      .loginAs(vendorUser!)
      .form({
        ...timeslotPayload,
      })
      .withCsrfToken()

    const response = await client
      .get(route('api.timeslot_plan.index'))
      .withGuard('web')
      .loginAs(vendorUser!)
      .withCsrfToken()

    response.assertTextIncludes('plan 1')
  })
  test('available slots without booking limit', async ({ client, route, assert }) => {
    await client
      .post(route('api.timeslot_plan.store'))
      .withGuard('web')
      .loginAs(vendorUser!)
      .form({
        ...timeslotPayload,
      })
      .withCsrfToken()

    const tomorow = DateTime.local().plus({ day: 1 })

    const response = await client
      .get(
        route('api.timeslot_plan.get_available_slots', [
          1,
          tomorow.year,
          tomorow.month,
          tomorow.day,
        ])
      )
      .withGuard('web')
      .loginAs(vendorUser!)
      .withCsrfToken()

    assert.lengthOf(response.body()?.data, 3)
  })

  test('available slots with booking limit', async ({ client, route, assert }) => {
    // create time slot
    const creatTimeSlotRes = await client
      .post(route('api.timeslot_plan.store'))
      .withGuard('web')
      .loginAs(vendorUser!)
      .form({
        ...timeslotPayload,
        limitToOneBooking: true,
      })
      .withCsrfToken()

    creatTimeSlotRes.assertTextIncludes('Plan Created')

    // create service and assign timeslot
    const asignTimeslotRes = await client
      .post(route('vendor.service.create.post'))
      .withGuard('web')
      .loginAs(vendorUser!)
      .form({
        ...servicePayload,
        timeSlotPlanId: 1,
      })
      .withInertia()
      .withCsrfToken()

    asignTimeslotRes.assertTextIncludes('Service Created')

    // create booking with timeslot
    const createBookingRes = await client
      .post(route('web.booking.create'))
      .withGuard('web')
      .loginAs(customerUser!)
      .form({
        ...createBookingPayload,
        timeSlotPlanId: 1,
      })
      .withCsrfToken()
      .withSession({ 'booking-summary': 1 })
      .withInertia()

    createBookingRes.assertTextIncludes('Booking Created')

    // get avaialable timeslots
    const tomorow = DateTime.local().plus({ day: 1 })

    const response = await client
      .get(
        route('api.timeslot_plan.get_available_slots', [
          1,
          tomorow.year,
          tomorow.month,
          tomorow.day,
        ])
      )
      .withGuard('web')
      .loginAs(vendorUser!)
      .withCsrfToken()
    response.dumpBody()

    assert.lengthOf(response.body()?.data, 2)
  })

  test('delete', async ({ client, route }) => {
    // create time slot
    await client
      .post(route('api.timeslot_plan.store'))
      .withGuard('web')
      .loginAs(vendorUser!)
      .form({
        ...timeslotPayload,
      })
      .withCsrfToken()

    const response = await client
      .delete(route('api.timeslot_plan.destroy', [1]))
      .withGuard('web')
      .loginAs(vendorUser!)
      .withCsrfToken()
    response.assertTextIncludes('Plan Deleted')
  })
})
