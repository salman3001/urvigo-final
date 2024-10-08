import User from '#models/user'
import AuthService from '#services/auth_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WebAuthsController {
  constructor(protected authService: AuthService) {}

  async login({ response, request, session, auth }: HttpContext) {
    const user = await this.authService.login()
    const next = request.qs()?.next

    if (user instanceof User) {
      await auth.use('web').login(user)
      session.flash('flash', {
        message: 'Login Success!',
        type: 'success',
      })

      if (next) {
        return response.redirect().toPath(next)
      } else {
        return response.redirect().toRoute('home')
      }
    } else {
      session.flash('flash', {
        message: 'Invalid Credentials!',
        type: 'error',
      })
    }
  }

  async signup({ response, session, auth }: HttpContext) {
    const user = await this.authService.signup()
    await auth.use('web').login(user)
    session.flash('flash', {
      message: 'Account Created !',
      type: 'success',
    })
    return response.redirect().toRoute('home')
  }

  async sendForgotPasswordOtp({ response, session }: HttpContext) {
    const user = await this.authService.sendForgotPasswordOtp()
    if (!user) {
      session.flash('flash', {
        message: 'Invalid Credentials',
        type: 'error',
      })
      return response.redirect().toRoute('auth.forgot-password')
    } else {
      session.flash('flash', {
        message: 'OTP Sent',
        type: 'success',
      })
      return response.redirect().withQs({ email: user?.email }).toRoute('auth.reset-password')
    }
  }

  async resetPassword({ response, session }: HttpContext) {
    const data = await this.authService.varifyOtpAndUpdatePassword()
    if (data === 'Invalid OTP') {
      session.flash('flash', {
        message: 'Invalid OTP',
        type: 'error',
      })
      return response.redirect().toRoute('auth.reset-password')
    } else if (data === 'Invalid Email') {
      session.flash('flash', {
        message: 'Invalid Email ID',
        type: 'error',
      })
      return response.redirect().toRoute('auth.reset-password')
    } else {
      session.flash('flash', {
        message: 'Password Reset Successfully',
        type: 'success',
      })
      return response.redirect().toRoute('home')
    }
  }

  async logout({ response, session }: HttpContext) {
    await this.authService.logout()
    session.flash('flash', { message: 'Logout Success', type: 'success' })
    return response.redirect().toRoute('home')
  }
}
