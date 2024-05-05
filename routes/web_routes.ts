import commonConfig from '#config/common'
import { middleware } from '#start/kernel'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import { sep, normalize } from 'node:path'
const WebAuthsController = () => import('#controllers/web/web_auths_controller')
const WebPagesController = () => import('#controllers/web/web_pages_controller')
const WebBookingsController = () => import('#controllers/web/web_bookings_controller')
const WebCustomBookingsController = () => import('#controllers/web/web_custom_bookings_controller')
const WebServiceRequirementsController = () =>
  import('#controllers/web/web_service_requirements_controller')

// auth
router
  .group(() => {
    router
      .group(() => {
        router.on('login').renderInertia('auth/login').as('login')
        router.post('login', [WebAuthsController, 'login']).as('login.post')
        router.on('signup').renderInertia('auth/signup').as('signup')
        router.post('signup', [WebAuthsController, 'signup']).as('signup.post')
        router.on('vendor-signup/:type').renderInertia('auth/vendor-signup').as('vendor.signup')
        router
          .post('signup/new', [WebAuthsController, 'signupVendorNew'])
          .as('vendor.signup.new.post')
        router
          .post('signup/existing-user', [WebAuthsController, 'signupVendorExistingUser'])
          .as('vendor.signup.existing.post')
        router.on('forgot-password').renderInertia('auth/forgot-password').as('forgot-password')
        router
          .post('forgot-password', [WebAuthsController, 'sendForgotPasswordOtp'])
          .as('forgot-password.post')
        router.on('reset-password').renderInertia('auth/reset-password').as('auth.reset-password')
        router
          .post('reset-password', [WebAuthsController, 'resetPassword'])
          .as('reset-password.post')
      })
      .use([middleware.guest()])

    router.get('logout', [WebAuthsController, 'logout']).as('logout')
  })
  .prefix('auth')
  .as('web.auth')

//pages

router
  .group(() => {
    router.get('', [WebPagesController, 'home']).as('home')
    router.on('/temp').renderInertia('temp').as('temp')
    router.post('/temp-post', [WebPagesController, 'temp']).as('temp.post')
    router.get('/services', [WebPagesController, 'services']).as('services')
    router.get('/services/:slug', [WebPagesController, 'services_show']).as('services.show')

    // with auth
    router
      .group(() => {
        router
          .post('/services/:id/create-review', [WebPagesController, 'createReview'])
          .as('services.create_review')

        // bookings
        router.get('bookings', [WebBookingsController, 'index']).as('booking.list')
        router.get('bookings/:id', [WebBookingsController, 'show']).as('booking.show')
        router
          .get('bookings/checkout/summary', [WebBookingsController, 'summary'])
          .as('booking.summary')
        router
          .get('bookings/checkout/address', [WebBookingsController, 'address'])
          .as('booking.address')
        router
          .post('bookings/checkout/address', [WebBookingsController, 'addressPost'])
          .as('booking.address.post')
        router
          .get('bookings/checkout/payment', [WebBookingsController, 'payment'])
          .as('booking.payment')
        router
          .post('bookings/checkout/payment', [WebBookingsController, 'paymentPost'])
          .as('booking.payment.post')
        router
          .post('bookings/checkout/create-booking', [WebBookingsController, 'createBooking'])
          .as('booking.create')
        router
          .get('bookings/checkout/confirmation', [WebBookingsController, 'confirmation'])
          .as('booking.confirmation')

        // custom bookings
        router
          .get('custom-bookings', [WebCustomBookingsController, 'index'])
          .as('custom_booking.list')
        router
          .get('custom-bookings/:id', [WebCustomBookingsController, 'show'])
          .as('custom_booking.show')
        router
          .get('custom-bookings/checkout/summary', [WebCustomBookingsController, 'summary'])
          .as('custom_booking.summary')
        router
          .post('custom-bookings/create', [WebCustomBookingsController, 'createBooking'])
          .as('custom_booking.create')

        // service Requirements
        router
          .get('service-requirements', [WebServiceRequirementsController, 'index'])
          .as('service_requirement.list')
        router
          .get('service-requirements/my-list', [WebServiceRequirementsController, 'myList'])
          .as('service_requirement.my-list')
        router
          .post('service-requirements', [WebServiceRequirementsController, 'create'])
          .as('service_requirement.create')
        router
          .get('service-requirements/:id', [WebServiceRequirementsController, 'show'])
          .as('service_requirement.show')
        router
          .post('requirements/:id/negotiate', [WebServiceRequirementsController, 'negotiate'])
          .as('service_requirement.negotiate')

        // account
        router
          .group(() => {
            router.get('/profile', [WebPagesController, 'profile']).as('profile')
            router.post('/profile/:id', [WebPagesController, 'updatProfile']).as('profile.post')
            router.get('/security', [WebPagesController, 'security']).as('security')
            router.post('/security/:id', [WebPagesController, 'updateSecurity']).as('security.post')
            router.post('/security', [WebPagesController, 'updateSecurity']).as('post')
            router.get('/settings', [WebPagesController, 'settings']).as('settings')
            router.get('/wishlist', [WebPagesController, 'wishlist']).as('wishlist')
            router
              .post('/wishlist/add-item', [WebPagesController, 'AddWishlistItem'])
              .as('wishlist.add_item')
            router
              .post('/wishlist/remove-item', [WebPagesController, 'RemoveWishlistItem'])
              .as('wishlist.remove_item')
            router
              .post('/wishlist/clear', [WebPagesController, 'ClearWishlist'])
              .as('wishlist.clear')
            router.get('/notifications', [WebPagesController, 'notifications']).as('notifications')
          })
          .prefix('account')
          .as('account')

        // vendor profile
        router
          .group(() => {
            router.get('/:id/about/', [WebPagesController, 'vendorProfile']).as('about')
            router.get('/:id/services/', [WebPagesController, 'vendorServices']).as('services')
            router
              .get('/:id/reviews/:vendorId', [WebPagesController, 'vendorReviews'])
              .as('reviews')
          })
          .prefix('vendor-profile')
          .as('vendor-profile')

        router.get('chat', [WebPagesController, 'chat']).as('chat')
        router.post('chat/:id', [WebPagesController, 'createChatMessage']).as('chat.create-masaage')

        router.on('/not-found').renderInertia('error').as('not-found')
        router.on('/under-maintenance').renderInertia('under-maintenance').as('under-maintenance')
        router.on('/denied').renderInertia('not-authorized').as('deined')
        router.on('/comming-soon').renderInertia('coming-soon').as('comming-soon')
      })
      .use(middleware.auth({ guards: ['web'] }))
  })
  .as('web')

// uploads
const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router.get('/uploads/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath(commonConfig.uploadPath, normalizedPath)
  return response.download(absolutePath)
})
export { router }
