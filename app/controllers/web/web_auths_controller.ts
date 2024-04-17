// import type { HttpContext } from '@adonisjs/core/http'

import AuthService from '#services/auth_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WebAuthsController {
  constructor(protected authService: AuthService) {}

  async login({ inertia, request, session }: HttpContext) {
    await this.authService.login()
    const next = request.qs()?.next
    session.flash('flash', {
      message: 'Login Success!',
      type: 'success',
    })
    if (next) {
      return inertia.render(next)
    } else {
      return inertia.render('home')
    }
  }

  async signup({ inertia, session }: HttpContext) {
    await this.authService.signup()
    session.flash('flash', {
      message: 'Account Created !',
      type: 'success',
    })
    return inertia.render('home')
  }

  async sendForgotPasswordOtp({ inertia, response, session }: HttpContext) {
    const user = await this.authService.sendForgotPasswordOtp()
    if (!user) {
      session.flash('flash', {
        message: 'Invalid Credentials',
        type: 'error',
      })
      return response.redirect().toRoute('auth/forget-password')
    } else {
      session.flash('flash', {
        message: 'OTP Sent',
        type: 'success',
      })
      return inertia.render('auth/reset-password')
    }
  }

  async resetPassword({ inertia, response, session }: HttpContext) {
    const data = await this.authService.varifyOtpAndUpdatePassword()
    if (data === 'Invalid OTP') {
      session.flash('flash', {
        message: 'Invalid OTP',
        type: 'error',
      })
      return response.redirect().toRoute('auth/reset-password')
    } else if (data === 'Invalid Email') {
      session.flash('flash', {
        message: 'Invalid Email ID',
        type: 'error',
      })
      return response.redirect().toRoute('auth/reset-password')
    } else {
      session.flash('flash', {
        message: 'Password Reset Successfully',
        type: 'success',
      })
      return inertia.render('auth/home')
    }
  }
}
