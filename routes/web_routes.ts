const WebAuthsController = () => import('#controllers/web/web_auths_controller')
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.on('login').renderInertia('auth/login')
    router.post('login', [WebAuthsController, 'login'])
    router.on('signup').renderInertia('auth/signup')
    router.post('signup', [WebAuthsController, 'signup'])
    router.on('forgot-password').renderInertia('auth/forgot-password')
    router.post('forgot-password', [WebAuthsController, 'sendForgotPasswordOtp'])
    router.on('reset-password').renderInertia('auth/reset-password')
    router.post('reset-password', [WebAuthsController, 'resetPassword'])
  })
  .prefix('auth')
