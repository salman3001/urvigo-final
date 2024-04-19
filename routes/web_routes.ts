import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const WebAuthsController = () => import('#controllers/web/web_auths_controller')
const WebPagesController = () => import('#controllers/web/web_pages_controller')
const WebBookingsController = () => import('#controllers/web/web_bookings_controller')

// auth
router
  .group(() => {
    router.on('login').renderInertia('auth/login').as('auth.login').use([middleware.guest()])
    router
      .post('login', [WebAuthsController, 'login'])
      .as('auth.login.post')
      .use([middleware.guest()])
    router.on('signup').renderInertia('auth/signup').as('auth.signup').use([middleware.guest()])
    router
      .post('signup', [WebAuthsController, 'signup'])
      .as('auth.signup.post')
      .use([middleware.guest()])
    router
      .on('forgot-password')
      .renderInertia('auth/forgot-password')
      .as('auth.forgot-password')
      .use([middleware.guest()])
    router
      .post('forgot-password', [WebAuthsController, 'sendForgotPasswordOtp'])
      .as('auth.forgot-password.post')
      .use([middleware.guest()])
    router
      .on('reset-password')
      .renderInertia('auth/reset-password')
      .as('auth.reset-password')
      .use([middleware.guest()])
    router
      .post('reset-password', [WebAuthsController, 'resetPassword'])
      .as('auth.reset-password.post')
      .use([middleware.guest()])
    router.get('logout', [WebAuthsController, 'logout']).as('auth.logout')
  })
  .prefix('auth')

//pages

router.group(() => {
  router.get('/', [WebPagesController, 'home']).as('home')
  router.get('/services', [WebPagesController, 'services']).as('web.services')
  router.get('/services/:slug', [WebPagesController, 'services_show']).as('web.services.show')

  // with auth
  router
    .group(() => {
      router
        .post('/services/:id/create-review', [WebPagesController, 'createReview'])
        .as('web.services.create_review')

      // bookings
      router
        .group(() => {
          router.get('/', [WebBookingsController, 'index']).as('web.booking.list')
          router.get('/:id', [WebBookingsController, 'show']).as('web.booking.show')
          router.get('/checkout/summary', [WebBookingsController, 'summary']).as('web.booking.summary')
          router.get('/checkout/address', [WebBookingsController, 'address']).as('web.booking.address')
          router.get('/checkout/payment', [WebBookingsController, 'payment']).as('web.booking.payment')
          router.post('/checkout/create-booking', [WebBookingsController, 'createBooking']).as('web.booking.create')
          router.get('/checkout/confirmation', [WebBookingsController, 'confirmation']).as('web.booking.confirmation')
        })
        .prefix('bookings')

      // custom bookings
      router
        .group(() => {
          router.get('/', [WebBookingsController, 'index']).as('web.custom_booking.list')
          router.get('/:id', [WebBookingsController, 'show']).as('web.custom_booking.show')
          router.get('/checkout/summary', [WebBookingsController, 'summary']).as('web.custom_booking.summary')
        })
        .prefix('custom-bookings')
    })
    .use(middleware.auth())
})
