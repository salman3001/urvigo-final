import { paginate } from '#helpers/common'
import User from '#models/user'
import { updateUserValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import FileService from './file_service.js'
import vine from '@vinejs/vine'
import { userTypes } from '#helpers/enums'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class UserService {
  constructor(
    protected ctx: HttpContext,
    protected fileService: FileService
  ) {}

  async index() {
    const { request, bouncer } = this.ctx
    await bouncer.with('userPolicy').authorize('viewList')
    const userQuery = User.query()

    const users = await paginate(userQuery, request)

    return users
  }

  async show() {
    const { params, bouncer } = this.ctx
    const user = await User.query()
      .where('id', +params.id)
      .preload('profile')
      .preload('businessProfile')
      .firstOrFail()

    await bouncer.with('userPolicy').authorize('view')

    return user
  }

  async me() {
    const { bouncer, auth } = this.ctx
    const user = await User.query()
      .where('id', auth.user!?.id)
      .preload('profile')
      .preload('businessProfile')
      .firstOrFail()

    await bouncer.with('userPolicy').authorize('view')

    return user
  }

  async update() {
    const { request, params, bouncer } = this.ctx
    const id = params.id
    const user = await User.findOrFail(id)
    await bouncer.with('userPolicy').authorize('update', user)
    const { avatar, businessProfile, logo, images, ...payload } = await request.validateUsing(
      updateUserValidator,
      {
        meta: {
          userId: params.id,
          businessProfileId: user.businessProfile?.id,
        },
      }
    )

    await db.transaction(async (trx) => {
      user.useTransaction(trx)
      user.merge(payload)
      await user.save()

      if (businessProfile) {
        user.load('businessProfile')
        if (user.businessProfile) {
          user.businessProfile.useTransaction(trx)
          user.businessProfile.merge(businessProfile)
          await user.businessProfile.save()
        } else {
          await user.related('businessProfile').create(businessProfile)
        }

        await user.load('businessProfile')

        if (logo) {
          const businessLogo = await this.fileService.uploadeImage(logo, 'business-profiles/logos')
          user.businessProfile.merge({ avatar: businessLogo })
          await user.businessProfile.save()
        }

        if (images) {
          for await (const img of images) {
            const updaloadedImage = await this.fileService.uploadeImage(
              img,
              'business-profiles/images'
            )
            await user.businessProfile.related('images').create({ file: updaloadedImage })
          }
        }
      }

      if (avatar) {
        const image = await this.fileService.uploadeImage(avatar, 'user/avatar')
        await user.related('profile').updateOrCreate(
          { userId: user.id },
          {
            avatar: image,
          }
        )
      }
    })

    return user
  }

  async banUser() {
    const { params, bouncer } = this.ctx
    await bouncer.with('userPolicy').authorize('delete')
    const user = await User.findOrFail(+params.id)
    user.isActive = false
    await user.save()
    return user
  }

  async updateUserPassword() {
    const { params, request, bouncer } = this.ctx
    const user = await User.findOrFail(+params.id)

    await bouncer.with('userPolicy').authorize('update', user)

    const validationSchema = vine.compile(
      vine.object({
        old_password: vine.string().trim(),
        password: vine.string().minLength(8).trim(),
        password_confirmation: vine.string().confirmed({ confirmationField: 'password' }),
      })
    )

    const payload = await request.validateUsing(validationSchema)
    if (await hash.verify(user.password, payload.old_password)) {
      user.password = payload.password
      await user.save()
      return user
    } else {
      return 'invalid'
    }
  }

  async updateSubscribedCategories() {
    const { request, bouncer, auth } = this.ctx
    const user = auth.user as User

    const isVendorUser = user?.userType === userTypes.VENDER
    if (!isVendorUser) {
      return 'Not Authorized'
    }

    await bouncer.with('userPolicy').authorize('update', user)

    const validationSchema = vine.compile(
      vine.object({
        serviceCategoryIds: vine.array(vine.number()),
      })
    )

    const payload = await request.validateUsing(validationSchema)
    await user.related('subscribedCategories').detach()
    await user.related('subscribedCategories').attach(payload.serviceCategoryIds)

    return 'updated'
  }

  async destroy() {
    const { params, bouncer } = this.ctx
    const user = await User.query()
      .where('id', +params.id)
      .preload('profile')
      .preload('businessProfile', (b) => {
        b.preload('images')
      })
      .firstOrFail()

    await bouncer.with('userPolicy').authorize('delete')

    if (user?.profile?.avatar) {
      await this.fileService.deleteImage(user.profile.avatar)
    }

    if (user?.businessProfile?.images) {
      for await (const img of user?.businessProfile?.images) {
        await this.fileService.deleteImage(img?.file)
      }
    }

    await user.delete()

    return user
  }
}
