import commonConfig from '#config/common'
import { middleware } from '#start/kernel'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import { sep, normalize } from 'node:path'
const WebAuthsController = () => import('#controllers/web/web_auths_controller')
const WebPagesController = () => import('#controllers/web/web_pages_controller')
const WebBookingsController = () => import('#controllers/web/web_bookings_controller')
const WebCustomBookingsController = () => import('#controllers/web/web_custom_bookings_controller')

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
  router.on('/temp').renderInertia('temp').as('temp')
  router.post('/temp-post', [WebPagesController, 'temp']).as('temp.post')
  router.get('/services', [WebPagesController, 'services']).as('web.services')
  router.get('/services/:slug', [WebPagesController, 'services_show']).as('web.services.show')

  // with auth
  router
    .group(() => {
      router
        .post('/services/:id/create-review', [WebPagesController, 'createReview'])
        .as('web.services.create_review')

      // Account
      router
        .group(() => {
          router.get('/profile', [WebPagesController, 'profile']).as('web.profile')
          router.get('/security', [WebPagesController, 'security']).as('web.security')
          router
            .get('/notifications', [WebPagesController, 'notifications'])
            .as('web.notifications')
          router.get('/wishlist', [WebPagesController, 'wishlist']).as('web.wishlist')
          router.get('/settings', [WebPagesController, 'settings']).as('web.settings')
        })
        .prefix('account')

      // bookings
      router
        .group(() => {
          router.get('/', [WebBookingsController, 'index']).as('web.booking.list')
          router.get('/:id', [WebBookingsController, 'show']).as('web.booking.show')
          router
            .get('/checkout/summary', [WebBookingsController, 'summary'])
            .as('web.booking.summary')
          router
            .get('/checkout/address', [WebBookingsController, 'address'])
            .as('web.booking.address')
          router
            .get('/checkout/payment', [WebBookingsController, 'payment'])
            .as('web.booking.payment')
          router
            .post('/checkout/create-booking', [WebBookingsController, 'createBooking'])
            .as('web.booking.create')
          router
            .get('/checkout/confirmation', [WebBookingsController, 'confirmation'])
            .as('web.booking.confirmation')
        })
        .prefix('bookings')

      // custom bookings
      router
        .group(() => {
          router.get('/', [WebCustomBookingsController, 'index']).as('web.custom_booking.list')
          router.get('/:id', [WebCustomBookingsController, 'show']).as('web.custom_booking.show')
          router
            .get('/checkout/summary', [WebCustomBookingsController, 'summary'])
            .as('web.custom_booking.summary')
        })
        .prefix('custom-bookings')

      // service Requirements
      router
        .group(() => {
          router
            .get('/', '#controllers/web/web_service_requirements_controller.index')
            .as('web.service_requirement.list')
          router
            .post('/', '#controllers/web/web_service_requirements_controller.create')
            .as('web.service_requirement.create')
          router
            .get('/:id', '#controllers/web/web_service_requirements_controller.show')
            .as('web.service_requirement.show')
        })
        .prefix('service-requirements')
    })
    .use(middleware.auth())
})

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
