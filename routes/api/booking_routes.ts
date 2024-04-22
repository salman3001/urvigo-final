import router from '@adonisjs/core/services/router'
import { middleware } from '../../start/kernel.js'
const BookingController = () => import('#controllers/api/api_bookings_controller')
const BidBookingController = () => import('#controllers/api/api_bid_bookings_controller')
const CouponController = () => import('#controllers/api/api_coupons_controller')

router
  .group(() => {
    // bookings
    router.post('bookings/summary', [BookingController, 'summary']).as('bookings.summary')
    router.get('bookings/my-list', [BookingController, 'myList']).as('bookings.my_list')
    // router.get('bookings/vendor-bookings', 'booking/BookingController.venodrBookingList')
    router
      .put('bookings/:id/update-status', [BookingController, 'updateStatus'])
      .as('bookings.update_status')
    router.resource('bookings', BookingController).only(['index', 'store', 'show']).as('bookings')

    //bid bookings
    router.get('bid-bookings/my-list', [BidBookingController, 'myList']).as('bid-bookings.my_list')
    router
      .put('bid-bookings/:id/update-status', [BidBookingController, 'updateStatus'])
      .as('bid-bookings.update_status')
    router
      .resource('bid-bookings', BidBookingController)
      .only(['index', 'store', 'show'])
      .as('bid-bookings')

    // coupons
    router
      .get('coupons/applicable', [CouponController, 'aplicableCoupons'])
      .as('coupons.applicable_coupons')
    router
      .get('coupons/vendor-coupons', [CouponController, 'vendorCoupons'])
      .as('coupons.vendor_coupons')
    // router.post('coupons/:id/apply-to-services', 'CouponsController.applyToServices')
    // router.put('coupons/:id/update-services', 'booking/CouponsController.updateServices')
    router.resource('coupons', CouponController).apiOnly().as('coupons')
  })
  .prefix('api')
  .as('api')
  .use(middleware.auth({ guards: ['web', 'api'] }))
