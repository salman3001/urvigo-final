import { CouponType, permissions } from '#helpers/enums'
import { hasPermission, isAdmin, isVendor } from '#helpers/permission_helpers'
import Coupon from '#models/coupon'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'

export default class CouponPolicy extends BasePolicy {
  async viewList(user: User) {
    if (user) {
      return true
    } else {
      return false
    }
  }

  async vendorList(user: User) {
    if (user && isVendor(user)) {
      return true
    } else {
      return false
    }
  }

  async view(user: User, coupon: Coupon) {
    let isValidVandor = false
    if (isVendor(user)) {
      await user.load('businessProfile')
      isValidVandor =
        coupon.couponType === CouponType.VENDOR &&
        coupon.businessProfileId === user.businessProfile?.id
    }

    const isValidAdmin =
      isAdmin(user) &&
      (await hasPermission(user, permissions.MANAGE_COUPONS)) &&
      coupon.couponType === CouponType.ADMIN

    if (isValidAdmin) {
      return true
    } else if (isValidVandor) {
      return true
    } else {
      return false
    }
  }

  async create(user: User) {
    const isVandor = isVendor(user)
    const isValidAdmin = isAdmin(user) && (await hasPermission(user, permissions.MANAGE_COUPONS))

    if (isVandor || isValidAdmin) {
      return true
    } else {
      return false
    }
  }

  async update(user: User, coupon: Coupon) {
    let isValidVandor = false
    if (isVendor(user)) {
      await user.load('businessProfile')
      isValidVandor =
        coupon.couponType === CouponType.VENDOR &&
        coupon.businessProfileId === user.businessProfile?.id
    }

    const isValidAdmin =
      isAdmin(user) &&
      (await hasPermission(user, permissions.MANAGE_COUPONS)) &&
      coupon.couponType === CouponType.ADMIN

    if (isValidAdmin) {
      return true
    } else if (isValidVandor) {
      return true
    } else {
      return false
    }
  }

  async delete(user: User, coupon: Coupon) {
    let isValidVandor = false
    if (isVendor(user)) {
      await user.load('businessProfile')
      isValidVandor =
        coupon.couponType === CouponType.VENDOR &&
        coupon.businessProfileId === user.businessProfile?.id
    }

    const isValidAdmin =
      isAdmin(user) &&
      (await hasPermission(user, permissions.MANAGE_COUPONS)) &&
      coupon.couponType === CouponType.ADMIN

    if (isValidAdmin) {
      return true
    } else if (isValidVandor) {
      return true
    } else {
      return false
    }
  }
}
