import User from '#models/user'
import { getOtpValidator, updatePasswordValidator, varifyOtpValidator } from '#validators/auth'
import { createUserValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import config from '@adonisjs/core/services/config'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class AuthService {
  constructor(protected ctx: HttpContext) {}
  async login() {
    const { request, response } = this.ctx
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)
    const socketToken = Math.floor(100000 + Math.random() * 900000).toString()
    user.socketToken = socketToken
    await user.save()
    response.cookie('socket-token', socketToken, {
      httpOnly: false,
    })
    return user
  }

  async logout() {
    return this.ctx.auth.use('web').logout()
  }

  async signup() {
    const { passwordConfirmation, avatar, logo, images, businessProfile, ...payload } =
      await this.ctx.request.validateUsing(createUserValidator)

    await User.create({ ...payload, isActive: true })
    return await User.verifyCredentials(payload.email, payload.password)
  }

  async sendForgotPasswordOtp() {
    const payload = await this.ctx.request.validateUsing(getOtpValidator)

    const user = await User.findBy('email', payload.email)

    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000)
      user.otp = otp
      await user.save()
      await mail.sendLater((message) => {
        message
          .to(user.email)
          .from(config.get('common.mail_address_info'))
          .subject('Verify your email address')
          .text(otp.toString())
      })

      return user
    } else {
      return null
    }
  }

  async varifyOtpAndUpdatePassword() {
    const payload = await this.ctx.request.validateUsing(varifyOtpValidator)

    const user = await User.findBy('email', payload.email)

    if (user) {
      if (user.otp === payload.otp) {
        user.password = payload.password

        await user.save()
        return user
      } else {
        return 'Invalid OTP'
      }
    } else {
      return 'Invalid Email'
    }
  }

  async updateUserPassword() {
    const payload = await this.ctx.request.validateUsing(updatePasswordValidator)

    const user = await User.findOrFail(this.ctx.params?.id)

    if (user && (await hash.verify(user.password, payload.old_password))) {
      user.password = payload.password
      await user.save()
      return user
    } else {
      return 'Old password dont match'
    }
  }
}
