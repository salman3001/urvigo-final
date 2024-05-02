import router from '@adonisjs/core/services/router'
import { middleware } from '../start/kernel.js'
import { userTypes } from '#helpers/enums'
const WebVendorController = () => import('#controllers/web/web_vendor_controller')

router
  .group(() => {
    router.get('dashboard', [WebVendorController, 'dashboard']).as('dashboard')
    // services
    router.get('services', [WebVendorController, 'serviceIndex']).as('service.index')
    router.get('services/create', [WebVendorController, 'serviceCreate']).as('service.create')
    router.get('services/:slug', [WebVendorController, 'serviceShow']).as('service.show')
    router.post('services', [WebVendorController, 'serviceCreatePost']).as('service.create.post')
    router.get('services/:slug/edit', [WebVendorController, 'serviceEdit']).as('service.edit')
    router.put('services/:id/', [WebVendorController, 'serviceEditPost']).as('service.edit.post')
    router.delete('services/:id/', [WebVendorController, 'serviceDelete']).as('service.delete')
    router
      .delete('services/:id/delete-image/:imageId', [WebVendorController, 'serviceImageDelete'])
      .as('service.image.delete')
    // bookings
    router.get('bookings', [WebVendorController, 'bookingIndex']).as('booking.index')
    router.get('bookings/:id', [WebVendorController, 'bookingShow']).as('booking.show')
    router
      .post('bookings/:id/update-status', [WebVendorController, 'updateBookingStatus'])
      .as('booking.update-status')
    router
      .post('bookings/:id/request-completion', [WebVendorController, 'requestBookingCompletion'])
      .as('booking.request-completion')
    router
      .post('bookings/:id/accept-completion', [WebVendorController, 'acceptBookingCompletion'])
      .as('booking.accept-completion')
    // custom bookings
    router
      .get('custom-bookings', [WebVendorController, 'customBookingIndex'])
      .as('custom-booking.index')
    router
      .get('custom-bookings/:id', [WebVendorController, 'customBookingShow'])
      .as('custom-booking.show')
    router
      .post('custom-bookings/:id/update-status', [WebVendorController, 'updateCustomBookingStatus'])
      .as('custom-booking.update-status')
    router
      .post('custom-bookings/:id/request-completion', [
        WebVendorController,
        'requestCustomBookingCompletion',
      ])
      .as('custom-booking.request-completion')
    router
      .post('custom-bookings/:id/accept-completion', [
        WebVendorController,
        'acceptCustomBookingCompletion',
      ])
      .as('custom-booking.accept-completion')

    // requirements
    router.get('requirements', [WebVendorController, 'requirementIndex']).as('requirements.index')
    router.get('requirements/:id', [WebVendorController, 'requirementShow']).as('requirements.show')
    // bids
    router.get('my-bids', [WebVendorController, 'myBids']).as('my-bids.index')
    router.post('create-bid', [WebVendorController, 'createBid']).as('bids.create')
    router.post('bids/:id', [WebVendorController, 'acceptNegotiation']).as('bids.accept_negotiate')
    // coupons
    router.get('coupons', [WebVendorController, 'couponsIndex']).as('coupon.index')
    router.get('coupons/create', [WebVendorController, 'couponsCreate']).as('coupon.create')
    router.get('coupons/:slug', [WebVendorController, 'couponsShow']).as('coupon.show')
    router.post('coupons', [WebVendorController, 'couponsCreatePost']).as('coupon.create.post')
    router.get('coupons/:id/edit', [WebVendorController, 'couponsEdit']).as('coupon.edit')
    router.put('coupons/:id/', [WebVendorController, 'couponsEditPost']).as('coupon.edit.post')
    router.delete('coupons/:id/', [WebVendorController, 'couponsDelete']).as('coupon.delete')
  })
  .prefix('vendor')
  .as('vendor')
  .use([middleware.auth({ guards: ['web'] }), middleware.role(userTypes.VENDER)])
