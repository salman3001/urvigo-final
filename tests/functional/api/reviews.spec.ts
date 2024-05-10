import { userTypes } from '#helpers/enums'
import BusinessProfile from '#models/business_profile'
import User from '#models/user'
import { createUser, truncateTables } from '#tests/helpers/common'
import {
  createReviewReviewPayload,
  createServiceReviewPayload,
  servicePayload,
} from '#tests/helpers/payloads'
import { test } from '@japa/runner'

test.group('Api reviews', (group) => {
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
    await truncateTables(['reviews', 'services'])
  })

  group.teardown(async () => {
    await truncateTables(['services', 'users', 'business_profiles', 'services', 'reviews'])
  })
  test('create service review', async ({ client, route, assert }) => {
    // create service
    const createServiceRes = await client
      .post(route('vendor.service.create.post'))
      .withGuard('web')
      .loginAs(vendorUser!)
      .form({
        ...servicePayload,
      })
      .withInertia()
      .withCsrfToken()

    createServiceRes.assertTextIncludes('Service Created')

    // create service review
    const createReviewRes = await client
      .post(route('api.reviews.services.store', [1]))
      .withGuard('web')
      .loginAs(customerUser!)
      .form({
        ...createServiceReviewPayload,
      })
      .withCsrfToken()

    createReviewRes.assertTextIncludes('Review Created')

    // create service 2nd review
    const create2ndReviewRes = await client
      .post(route('api.reviews.services.store', [1]))
      .withGuard('web')
      .loginAs(vendorUser!)
      .form({
        ...createServiceReviewPayload,
        rating: 2,
      })
      .withCsrfToken()

    create2ndReviewRes.assertTextIncludes('Review Created')

    // create service 3rd time review
    const create3rdReviewRes = await client
      .post(route('api.reviews.services.store', [1]))
      .withGuard('web')
      .loginAs(customerUser!)
      .form({
        ...createServiceReviewPayload,
      })
      .withCsrfToken()

    create3rdReviewRes.assertTextIncludes('Review already exits')

    // get service review info
    const serviceReviewsInfo = await client.get(route('api.reviews.services.info', [1]))

    assert.containsSubset(serviceReviewsInfo.body(), {
      data: {
        totalReviews: '2',
        avgRating: '3.0',
      },
    })

    assert.containsSubset(serviceReviewsInfo.body()?.data?.counts, [
      {
        rating: 4,
        value: '1',
      },
      {
        rating: 2,
        value: '1',
      },
    ])

    // get all service reviews
    const getAllServiceReviewsRes = await client.get(route('api.reviews.services', [1]))

    getAllServiceReviewsRes.dumpBody()
    assert.lengthOf(getAllServiceReviewsRes.body()?.data?.data, 2)

    // create vendor review
    const createVendorReviewRes = await client
      .post(route('api.reviews.vendor.store', [1]))
      .withGuard('web')
      .loginAs(customerUser!)
      .form({
        ...createReviewReviewPayload,
      })
      .withCsrfToken()

    createVendorReviewRes.assertTextIncludes('Review Created')

    // create 2nd vendor review
    const createSecondVendorReviewRes = await client
      .post(route('api.reviews.vendor.store', [1]))
      .withGuard('web')
      .loginAs(vendorUser!)
      .form({
        ...createReviewReviewPayload,
        responseTime: 2,
        qualityOfService: 5,
        professionalBehavior: 1,
        communication: 1,
        fairPricing: 2,
      })
      .withCsrfToken()

    createSecondVendorReviewRes.assertTextIncludes('Review Created')

    // create 3rd vendor review
    const createThirdVendorReviewRes = await client
      .post(route('api.reviews.vendor.store', [1]))
      .withGuard('web')
      .loginAs(vendorUser!)
      .form({
        ...createReviewReviewPayload,
      })
      .withCsrfToken()

    createThirdVendorReviewRes.assertTextIncludes('Review already exits')

    // get all Vendor reviews
    const getAllVendorReviewsRes = await client.get(route('api.reviews.vendor', [1]))
    assert.lengthOf(getAllVendorReviewsRes.body()?.data?.data, 2)

    // get all Vendor reviews
    const getVendorReviewsInfoRes = await client.get(route('api.reviews.vendor.info', [1]))

    assert.containsSubset(getVendorReviewsInfoRes.body(), {
      data: {
        avgRating: '2.8',
        avgFairPricing: '2.0',
      },
    })

    assert.containsSubset(serviceReviewsInfo.body()?.data?.counts, [
      {
        rating: 4,
        value: '1',
      },
      {
        rating: 2,
        value: '1',
      },
    ])
  })
})
