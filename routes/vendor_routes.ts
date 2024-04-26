import router from '@adonisjs/core/services/router'
import { middleware } from '../start/kernel.js'
const WebVendorController = () => import('#controllers/web/web_vendor_controller')

router
  .group(() => {
    router.get('dashboard', [WebVendorController, 'dashboard']).as('dashboard')
    // services
    router.get('services', [WebVendorController, 'serviceIndex']).as('service.index')
    router.get('services/:slug', [WebVendorController, 'serviceShow']).as('service.show')
    router.get('services/create', [WebVendorController, 'serviceCreate']).as('service.create')
    router.post('services', [WebVendorController, 'serviceCreatePost']).as('service.create.post')
    router.get('services/:slug/edit', [WebVendorController, 'serviceEdit']).as('service.edit')
    router.post('services/:id/', [WebVendorController, 'serviceEditPost']).as('service.edit.post')
    // bookings
    router.get('bookings', [WebVendorController, 'bookingIndex']).as('booking.index')
    router.get('bookings/:id', [WebVendorController, 'bookingShow']).as('booking.show')
    // custom bookings
    router
      .get('custom-bookings', [WebVendorController, 'customBookingIndex'])
      .as('custom-booking.index')
    router
      .get('custom-bookings/:id', [WebVendorController, 'customBookingShow'])
      .as('custom-booking.show')

    // custom bookings
    router.get('requirements', [WebVendorController, 'requirementIndex']).as('requirements.index')
    router.get('requirements/:id', [WebVendorController, 'requirementShow']).as('requirements.show')
    // bids
    router.get('my-bids', [WebVendorController, 'myBids']).as('my-bids.index')
    // coupons
    router.get('coupons', [WebVendorController, 'couponsIndex']).as('coupon.index')
    router.get('coupons/create', [WebVendorController, 'couponsCreate']).as('coupon.create')
    router.get('coupons/:slug', [WebVendorController, 'couponsShow']).as('coupon.show')
    router.post('coupons', [WebVendorController, 'couponsCreatePost']).as('coupon.create.post')
    router.get('coupons/:id/edit', [WebVendorController, 'couponsEdit']).as('coupon.edit')
    router.post('coupons/:id/', [WebVendorController, 'couponsEditPost']).as('coupon.edit.post')
  })
  .prefix('vendor')
  .as('vendor')
  .use([middleware.auth({ guards: ['web'] }), middleware.role('vendor')])
