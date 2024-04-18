import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const WebAuthsController = () => import('#controllers/web/web_auths_controller')
const WebPagesController = () => import('#controllers/web/web_pages_controller')

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
  router.get('/', [WebPagesController, 'home'])
  router.get('/services', [WebPagesController, 'services'])
})
