import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import Address from '#models/address'
import User from '#models/user'
import vine from '@vinejs/vine'

@inject()
export default class AddressService {
  constructor(protected ctx: HttpContext) {}

  async index() {
    const { auth, bouncer } = this.ctx
    await bouncer.with('AddressPolicy').authorize('viewList')
    const user = auth.user! as User
    await user.load('profile')
    const addressQuery = Address.query().where('user_profile_id', user.profile.id)

    const addresses = await addressQuery.exec()

    return addresses
  }

  async store() {
    const { request, bouncer, auth } = this.ctx
    await bouncer.with('AddressPolicy').authorize('create')
    const validationSchema = vine.compile(
      vine.object({
        geoLocation: vine.string(),
        mapAddress: vine.string(),
        address: vine.string().escape().optional(),
      })
    )

    const user = auth.user as User
    await user?.load('profile')
    const payload = await request.validateUsing(validationSchema)

    const address = await auth.user?.profile.related('addresses').create(payload)

    return address
  }

  async update() {
    const { request, params, bouncer } = this.ctx
    await bouncer.with('AddressPolicy').authorize('update')

    const address = await Address.findOrFail(+params.id)

    const validationSchema = vine.compile(
      vine.object({
        geoLocation: vine.string(),
        mapAddress: vine.string(),
        address: vine.string().escape().optional(),
      })
    )
    const payload = await request.validateUsing(validationSchema)

    await address.merge(payload).save()

    return address
  }

  async destroy() {
    const { params, bouncer } = this.ctx
    const blog = await Address.findOrFail(+params.id)

    await bouncer.with('AddressPolicy').authorize('delete')

    await blog.delete()

    return blog
  }
}
