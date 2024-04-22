import type { HttpContext } from '@adonisjs/core/http'
import CouponService from '../../services/coupon_service.js'

export default class ApiCouponsController {
  constructor(protected couponService: CouponService) {}

  async index({ response }: HttpContext) {
    const coupons = await this.couponService.index()
    return response.custom({
      code: 200,
      data: coupons,
      message: null,
      success: true,
    })
  }

  async aplicableCoupons({ response }: HttpContext) {
    const coupons = await this.couponService.aplicableCoupons()
    return response.custom({
      code: 200,
      data: coupons,
      message: null,
      success: true,
    })
  }

  async vendorCoupons({ response }: HttpContext) {
    const coupons = await this.couponService.vendorCoupons()
    return response.custom({
      code: 200,
      data: coupons,
      message: null,
      success: true,
    })
  }

  async show({ response }: HttpContext) {
    const coupon = await this.couponService.show()
    return response.custom({
      code: 200,
      data: coupon,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const coupon = await this.couponService.store()
    return response.custom({
      code: 200,
      data: coupon,
      message: 'Coupon Created',
      success: true,
    })
  }

  async update({ response }: HttpContext) {
    const coupon = await this.couponService.update()
    return response.custom({
      code: 200,
      data: coupon,
      message: 'Coupon Updated',
      success: true,
    })
  }

  async destroy({ response }: HttpContext) {
    const coupon = await this.couponService.destroy()
    return response.custom({
      code: 200,
      data: coupon,
      message: 'Coupon Deleted',
      success: true,
    })
  }
}
