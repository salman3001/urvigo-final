import router from '@adonisjs/core/services/router'
import { middleware } from '../../start/kernel.js'

router
  .group(() => {
    // bookings
    router.post('bookings/summary', '#controllers/api/api_bookings_controller.summary')
    router.get('bookings/get-coupons', '#controllers/api/api_coupons_controller.aplicableCoupons')
    router.get('bookings/my-list', '#controllers/api/api_bookings_controller.myList')
    // router.get('bookings/vendor-bookings', 'booking/BookingController.venodrBookingList')
    router.put(
      'bookings/:id/update-status',
      '#controllers/api/api_bookings_controller.updateStatus'
    )
    router
      .resource('bookings', '#controllers/api/api_bookings_controller')
      .only(['index', 'store', 'show'])

    //bid bookings
    router.get('bid-bookings/my-list', '#controllers/api/api_bid_bookings_controller.myList')
    router.put(
      'bid-bookings/:id/update-status',
      '#controllers/api/api_bid_bookings_controller.updateStatus'
    )
    router
      .resource('bid-bookings', '#controllers/api/api_bid_bookings_controller')
      .only(['index', 'store', 'show'])

    // coupons
    router.get('coupons/vendor-coupons', '#controllers/api/api_coupons_controller.vendorCoupons')
    // router.post('coupons/:id/apply-to-services', 'CouponsController.applyToServices')
    // router.put('coupons/:id/update-services', 'booking/CouponsController.updateServices')
    router.resource('coupons', '#controllers/api/api_coupons_controller').apiOnly()
  })
  .prefix('api')
  .use(middleware.auth({ guards: ['web', 'api'] }))
