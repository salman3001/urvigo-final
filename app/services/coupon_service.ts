import { CouponType, userTypes } from '#helpers/enums'
import Coupon from '#models/coupon'
import ServiceVariant from '#models/service_variant'
import {
  couponIndexValidator,
  createCouponValidator,
  updateCouponValidator,
} from '#validators/coupon'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { paginate } from '../helpers/common.js'
import { IndexOption } from '../helpers/types.js'
import { DateTime } from 'luxon'

@inject()
export default class CouponService {
  constructor(protected ctx: HttpContext) {}

  async aplicableCoupons() {
    const { bouncer, request } = this.ctx
    await bouncer.with('CouponPolicy').authorize('viewList')

    const payload = await request.validateUsing(couponIndexValidator)
    const serviceVariant = await ServiceVariant.query()
      .where('id', payload.serviceVariantId)
      .preload('service', (service) => {
        service.select('id')
      })
      .first()

    const serviceIds = serviceVariant?.service?.id as number

    const coupons = await Coupon.query()
      .where('valid_from', '<', DateTime.now().toSQL())
      .where('expired_at', '>', DateTime.now().toSQL())
      .whereColumn('total_used', '<', 'max_users')
      .whereHas('services', (service) => {
        service.where('services.id', serviceIds)
      })

    const adminCoupons = await Coupon.query().where('coupon_type', CouponType.ADMIN)
    //   .where('expired_at', '>', DateTime.local().plus({ minute: 10 }).toSQL())
    //   .where('valid_from', '<', DateTime.local().toSQL())

    return [...coupons, ...adminCoupons]
  }

  async index(opt?: IndexOption) {
    const { request, bouncer } = this.ctx
    await bouncer.with('CouponPolicy').authorize('viewList')
    const couponQuery = Coupon.query().where('coupon_type', CouponType.ADMIN)

    !opt?.disableFilter && couponQuery.filter(request.qs())
    const coupons = await paginate(couponQuery, request)

    return coupons
  }

  async show() {
    const { bouncer, params } = this.ctx
    const id = params.id
    const coupon = await Coupon.query()
      .where('id', id)
      .preload('services', (s) => {
        s.select('id')
      })
      .firstOrFail()

    await bouncer.with('CouponPolicy').authorize('view', coupon)

    return coupon
  }

  async vendorCoupons(opt?: IndexOption) {
    const { bouncer, auth, request } = this.ctx
    await bouncer.with('CouponPolicy').authorize('vendorList')
    const user = auth.user!

    await user?.load('businessProfile')

    const couponQuery = Coupon.query().where('business_profile_id', user.businessProfile.id)

    !opt?.disableFilter && couponQuery.filter(request.qs())

    const coupons = await paginate(couponQuery, request)

    return coupons
  }

  async store() {
    const { auth, bouncer, request } = this.ctx
    await bouncer.with('CouponPolicy').authorize('create')

    const { serviceIds, ...payload } = await request.validateUsing(createCouponValidator)

    const user = auth.user!

    let coupon: Coupon | null = null

    if (user.userType === userTypes.VENDER) {
      await user.load('businessProfile')
      coupon = await Coupon.create({
        ...payload,
        businessProfileId: user.businessProfile.id,
        couponType: CouponType.VENDOR,
      })

      await coupon.related('services').attach(serviceIds)
    }

    if (user.userType === userTypes.ADMIN) {
      coupon = await Coupon.create({
        ...payload,
        couponType: CouponType.VENDOR,
      })
    }

    return coupon!
  }

  async update() {
    const { bouncer, request, params } = this.ctx
    const coupon = await Coupon.findOrFail(+params.id)
    await bouncer.with('CouponPolicy').authorize('update', coupon)

    const { serviceIds, ...payload } = await request.validateUsing(updateCouponValidator)

    coupon.merge(payload)
    if (serviceIds) {
      await coupon.related('services').detach()
      await coupon.related('services').attach(serviceIds)
    }
    await coupon.save()
    return coupon
  }

  async destroy(): Promise<'Deleted'> {
    const { params, bouncer } = this.ctx
    const coupon = await Coupon.findOrFail(+params.id)

    await bouncer.with('CouponPolicy').authorize('delete', coupon)

    await coupon.delete()

    return 'Deleted'
  }
}
