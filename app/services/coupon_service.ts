import { CouponType } from '#helpers/enums'
import Coupon from '#models/coupon'
import ServiceVariant from '#models/service_variant'
import { couponIndexValidator } from '#validators/coupon'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CouponService {
  constructor(protected ctx: HttpContext) {}

  async index() {
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
      //   .where('expired_at', '>', DateTime.local().plus({ minute: 10 }).toSQL())
      //   .where('valid_from', '<', DateTime.local().toSQL())
      .whereHas('services', (service) => {
        service.where('services.id', serviceIds)
      })

    const adminCoupons = await Coupon.query().where('coupon_type', CouponType.ADMIN)
    //   .where('expired_at', '>', DateTime.local().plus({ minute: 10 }).toSQL())
    //   .where('valid_from', '<', DateTime.local().toSQL())

    return [...coupons, ...adminCoupons]
  }
}
