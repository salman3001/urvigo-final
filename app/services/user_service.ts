import { paginate } from '#helpers/common'
import { IserviceProps } from '#helpers/types'
import User from '#models/user'
import { updateUserValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UserService {
  constructor(protected ctx: HttpContext) {}

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
      .preload('businessProfile', (b) => {
        b.preload('reviews', (r) => {
          r.limit(10).orderBy('created_at')
        }).withCount('reviews')
      })
      .firstOrFail()

    await bouncer.with('userPolicy').authorize('view', user)

    return user
  }

  async update() {
    const { request, response, params, bouncer } = this.ctx
    const id = params.id
    const user = await User.findOrFail(id)
    await bouncer.with('userPolicy').authorize('update', user)
    await user.load('businessProfile')
    const payload = await request.validateUsing(updateUserValidator, {
      meta: {
        userId: params.id,
        businessProfileId: user.businessProfile?.id,
      },
    })

    user.merge(payload)
    await user.save()

    return response.custom({
      message: 'User updated Successfully',
      code: 201,
      data: user,
      success: true,
    })
  }

  async updateProfile({ request, response, params, bouncer }: HttpContextContract) {
    const user = await user.findOrFail(+params.id)

    const { address, avatar, images, logo, seo, profile, ...payload } = await request.validate(
      VendorProfileUpdateValidator
    )

    const vendorProfile = await VendorProfile.findByOrFail('vendor_user_id', user.id)

    if (!vendorProfile) {
      return response.custom({
        code: 404,
        message: 'User profile not found',
        data: null,
        success: false,
      })
    }

    await bouncer.with('BussinessPolicy').authorize('update', vendorProfile)

    await Database.transaction(async (trx) => {
      vendorProfile.useTransaction(trx)
      user.useTransaction(trx)
      user.merge(payload)
      await user.save()

      if (profile) {
        vendorProfile.merge(profile)
        await vendorProfile.save()
      }

      if (address) {
        await vendorProfile.load('addresses')

        if (vendorProfile.addresses) {
          for (const address of vendorProfile.addresses) {
            await address.delete()
          }
          await vendorProfile.related('addresses').createMany(address)
        } else {
          await vendorProfile.related('addresses').createMany(address)
        }
      }

      if (payload.social) {
        await vendorProfile?.load('social')
        if (vendorProfile?.social) {
          await vendorProfile.social.delete()
          await vendorProfile.related('social').create(payload.social)
        } else {
          await vendorProfile.related('social').create(payload.social)
        }
      }

      if (avatar) {
        vendorProfile.avatar = await ResponsiveAttachment.fromFile(avatar)
      }

      if (logo) {
        vendorProfile.logo = await ResponsiveAttachment.fromFile(logo)
      }

      if (images) {
        await vendorProfile.load('images')

        await Promise.all(
          vendorProfile.images.map(async (s) => {
            await s.delete()
          })
        )

        const createdImages = await Promise.all(
          images.map(async (img) => {
            try {
              const storeImg = await Image.create({
                file: await ResponsiveAttachment.fromFile(img),
              })
              return storeImg
            } catch (error) {
              console.error('Error storing image:', error)
              // Handle the error or decide whether to skip this image
              return null
            }
          })
        )

        // Filter out any null values (images that failed to store)
        const validImages = createdImages.filter((img) => img !== null)
        await vendorProfile.related('images').saveMany(validImages as Image[])
      }

      await vendorProfile.save()
    })

    return response.custom({
      message: 'Business profile Updated!',
      code: 201,
      data: vendorProfile,
      success: true,
    })
  }

  async banUser({ params, response, bouncer }: HttpContextContract) {
    await bouncer.with('VendorUserPolicy').authorize('delete')
    const user = await VendorUser.findOrFail(+params.id)
    user.isActive = false
    await user.save()
    return response.custom({
      message: 'User Banned Successfully',
      code: 200,
      data: user,
      success: true,
    })
  }

  async updateUserPassword({ params, response, request, bouncer }: HttpContextContract) {
    const user = await VendorUser.findOrFail(+params.id)

    await bouncer.with('VendorUserPolicy').authorize('update', user)

    const validationSchema = schema.create({
      password: schema.string({ trim: true }, [rules.minLength(8)]),
      password_confirmation: schema.string({ trim: true }, [rules.confirmed('password')]),
    })

    const payload = await request.validate({
      schema: validationSchema,
    })
    user.password = payload.password
    await user.save()
    return response.custom({
      message: 'Password changed',
      code: 200,
      data: user,
      success: true,
    })
  }

  async updateSubscribedCategories({ response, request, bouncer, auth }: HttpContextContract) {
    const user = auth.user

    const isVendorUser = user instanceof VendorUser
    if (!isVendorUser) {
      return response.custom({
        code: 401,
        data: null,
        message: 'Not Authorized',
        success: false,
      })
    }

    await bouncer.with('VendorUserPolicy').authorize('update', user)

    const validationSchema = schema.create({
      serviceCategoryIds: schema.array().members(schema.number()),
    })

    const payload = await request.validate({
      schema: validationSchema,
    })
    await user.related('subscribedCategories').detach()
    await user.related('subscribedCategories').attach(payload.serviceCategoryIds)

    return response.custom({
      message: 'Subscribed categories updated',
      code: 200,
      data: user,
      success: true,
    })
  }

  async destroy({ params, response, bouncer }: HttpContextContract) {
    const vendor = await VendorUser.findOrFail(+params.id)

    await bouncer.with('VendorUserPolicy').authorize('delete')

    await vendor.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: vendor,
    })
  }
}
