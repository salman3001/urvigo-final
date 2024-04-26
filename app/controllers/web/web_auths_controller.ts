import User from '#models/user'
import AuthService from '#services/auth_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { userTypes } from '../../helpers/enums.js'

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
        if (user.userType === userTypes.VENDER) {
          return response.redirect().toRoute('vendor.dashboard')
        }
        return response.redirect().toRoute('web.home')
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
    return response.redirect().toRoute('web.home')
  }

  async signupVendorNew({ response, session, auth }: HttpContext) {
    const user = await this.authService.signupVendorNew()
    await auth.use('web').login(user)
    session.flash('flash', {
      message: 'Account Created !',
      type: 'success',
    })
    return response.redirect().toRoute('web.home')
  }

  async signupVendorExistingUser({ response, session, auth }: HttpContext) {
    const user = await this.authService.signupVendorExistingUser()
    if (user === 'invalid') {
      session.flash('flash', {
        message: 'Invalid Credentials!',
        type: 'error',
      })

      return response.redirect().back()
    } else {
      await auth.use('web').login(user)
      session.flash('flash', {
        message: 'User account migrated to vendor account !',
        type: 'success',
      })
      return response.redirect().toRoute('web.home')
    }
  }

  async sendForgotPasswordOtp({ response, session }: HttpContext) {
    const user = await this.authService.sendForgotPasswordOtp()
    if (!user) {
      session.flash('flash', {
        message: 'Invalid Credentials',
        type: 'error',
      })
      return response.redirect().toRoute('web.auth.forgot-password')
    } else {
      session.flash('flash', {
        message: 'OTP Sent',
        type: 'success',
      })
      return response.redirect().withQs({ email: user?.email }).toRoute('web.auth.reset-password')
    }
  }

  async resetPassword({ response, session }: HttpContext) {
    const data = await this.authService.varifyOtpAndUpdatePassword()
    if (data === 'Invalid OTP') {
      session.flash('flash', {
        message: 'Invalid OTP',
        type: 'error',
      })
      return response.redirect().toRoute('web.auth.reset-password')
    } else if (data === 'Invalid Email') {
      session.flash('flash', {
        message: 'Invalid Email ID',
        type: 'error',
      })
      return response.redirect().toRoute('web.auth.reset-password')
    } else {
      session.flash('flash', {
        message: 'Password Reset Successfully',
        type: 'success',
      })
      return response.redirect().toRoute('web.home')
    }
  }

  async logout({ response, session }: HttpContext) {
    await this.authService.logout()
    session.flash('flash', { message: 'Logout Success', type: 'success' })
    return response.redirect().toRoute('web.home')
  }
}
