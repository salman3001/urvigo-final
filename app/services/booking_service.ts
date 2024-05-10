import { CouponType, DiscountType, OrderStatus, userTypes } from '#helpers/enums'
import Booking from '#models/booking'
import Coupon from '#models/coupon'
import ServiceVariant from '#models/service_variant'
import {
  BookingSummaryValidator,
  CreateBookingValidator,
  UpdateBookingStatusValidator,
  requestBookingCompletionValidator,
} from '#validators/booking'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import config from '@adonisjs/core/services/config'
import { BigNumber } from 'bignumber.js'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import { IndexOption } from '../helpers/types.js'
import { paginate } from '../helpers/common.js'
import BookedTimeslot from '#models/booked_timeslot'

@inject()
export default class BookingService {
  constructor(protected ctx: HttpContext) {}

  async index(opt?: IndexOption) {
    const { bouncer, request } = this.ctx
    await bouncer.with('BookingPolicy').authorize('viewList')
    const bookingQuery = Booking.query()
      .preload('user', (u) => {
        u.select(['id', 'first_name', 'last_name']).preload('profile', (p) => {
          p.select(['avatar'])
        })
      })
      .preload('businessProfile', (b) => {
        b.preload('vendor', (u) => {
          u.select(['id', 'first_name', 'last_name']).preload('profile', (p) => {
            p.select(['avatar'])
          })
        })
      })

    !opt?.disableFilter && bookingQuery.filter(request.qs())

    return await paginate(bookingQuery, request)
  }

  async myList() {
    const { bouncer, auth, request } = this.ctx
    await bouncer.with('BookingPolicy').authorize('myList')

    const user = auth.user!

    const bookingQuery = Booking.query()

    if (user.userType === userTypes.USER) {
      bookingQuery.where('user_id', user.id).preload('businessProfile', (b) => {
        b.preload('vendor', (u) => {
          u.select(['id', 'first_name', 'last_name']).preload('profile', (p) => {
            p.select(['avatar'])
          })
        })
      })
    }

    if (user.userType === userTypes.VENDER) {
      bookingQuery.whereHas('businessProfile', (b) => {
        b.whereHas('vendor', (u) => {
          u.where('user_id', user.id)
            .select(['id', 'first_name', 'last_name'])
            .preload('profile', (p) => {
              p.select(['avatar'])
            })
        })
      })
    }

    return await bookingQuery.paginate(
      request.qs()?.page || 1,
      request.qs()?.perPage || config.get('common.rowsPerPage')
    )
  }

  async show() {
    const { bouncer, params } = this.ctx
    const id = params.id
    const booking = await Booking.query()
      .preload('user')
      .preload('bookedTimeslot')
      .preload('businessProfile', (b) => {
        b.preload('vendor')
      })
      .where('id', id)
      .firstOrFail()

    await bouncer.with('BookingPolicy').authorize('view', booking)

    return booking
  }

  async summary() {
    const { bouncer, request } = this.ctx
    await bouncer.with('BookingPolicy').authorize('create')
    const payload = await request.validateUsing(BookingSummaryValidator)
    const bookingData = await this.getBookingData({
      serviceVariantId: payload.serviceVariantId,
      qty: payload.qty,
      couponId: payload?.couponId,
      alterMaxUsers: false,
    })
    return {
      ...bookingData,
      paymentDetail: {
        paymentMode: null,
        paymenAddress: null,
      },
      addressDetail: {
        address: '',
        mapAddress: '',
        mobile: '',
        geoLocation: '',
      },
      deliveryType: null,
    }
  }

  async store() {
    const { bouncer, request, auth } = this.ctx
    await bouncer.with('BookingPolicy').authorize('create')
    const payload = await request.validateUsing(CreateBookingValidator)
    const bookingData = await this.getBookingData({
      serviceVariantId: payload.serviceVariantId,
      qty: payload.qty,
      couponId: payload?.couponId,
      alterMaxUsers: true,
    })

    let booking: Booking | null = null

    await db.transaction(async (trx) => {
      booking = await Booking.create(
        {
          userId: auth.user!.id,
          status: OrderStatus.PLACED,
          history: [
            {
              date_time: DateTime.now(),
              event: 'Order Placed',
              remarks: '',
            },
          ],
          ...bookingData,
          paymentDetail: payload.paymentDetail as any,
          addressDetail: payload.addressDetail,
          deliveryType: payload.deliveryType,
        },
        { client: trx }
      )

      if (payload.timeslot) {
        const bookedslot = await BookedTimeslot.create(
          {
            startTime: payload.timeslot.from,
            endTime: payload.timeslot.to,
            timeslotPlanId: payload.timeslot.timeslotPlanId,
          },
          { client: trx }
        )

        await booking.related('bookedTimeslot').associate(bookedslot)
      }
    })

    return booking!
  }

  async updateStatus() {
    const { bouncer, request, params } = this.ctx
    const booking = await Booking.findOrFail(+params.id)
    await bouncer.with('BookingPolicy').authorize('update', booking)

    const payload = await request.validateUsing(UpdateBookingStatusValidator)

    if (payload.status === OrderStatus.CONFIRMED) {
      if (booking.status !== OrderStatus.PLACED) {
        return 'Invalid Status'
      } else {
        await db.transaction(async (trx) => {
          booking.useTransaction(trx)
          booking.merge({ status: payload.status })
          booking.history.push({
            date_time: DateTime.now(),
            event: `Booking ${payload.status}`,
            remarks: payload?.remarks || '',
          })
          await booking.save()
        })
      }
    }

    if (payload.status === OrderStatus.CANCLED) {
      if (
        booking.status === OrderStatus.REJECTED ||
        booking.status === OrderStatus.COMPLETED ||
        booking.status === OrderStatus.COMPLETION_REQUESTED
      ) {
        return 'Invalid Status'
      } else {
        await db.transaction(async (trx) => {
          booking.useTransaction(trx)
          booking.merge({ status: payload.status })
          booking.history.push({
            date_time: DateTime.now(),
            event: `Booking ${payload.status}`,
            remarks: payload?.remarks || '',
          })
          await booking.save()
        })
      }
    }

    if (payload.status === OrderStatus.REJECTED) {
      if (
        booking.status === OrderStatus.CANCLED ||
        booking.status === OrderStatus.COMPLETED ||
        booking.status === OrderStatus.COMPLETION_REQUESTED
      ) {
        return 'Invalid Status'
      } else {
        await db.transaction(async (trx) => {
          booking.useTransaction(trx)
          booking.merge({ status: payload.status })
          booking.history.push({
            date_time: DateTime.now(),
            event: `Booking ${payload.status}`,
            remarks: payload?.remarks || '',
          })
          await booking.save()
        })
      }
    }

    await booking.refresh()

    return booking
  }

  async requestCompletion() {
    const { bouncer, request, params } = this.ctx
    const booking = await Booking.findOrFail(+params.id)
    await bouncer.with('BookingPolicy').authorize('update', booking)

    const payload = await request.validateUsing(requestBookingCompletionValidator)

    if (booking.status === OrderStatus.CONFIRMED) {
      await db.transaction(async (trx) => {
        booking.useTransaction(trx)
        booking.merge({ status: OrderStatus.COMPLETION_REQUESTED })
        booking.history.push({
          date_time: DateTime.now(),
          event: 'Booking completion requested',
          remarks: payload?.remarks || '',
        })
        await booking.save()
      })

      return booking
    } else {
      return 'Invalid Request'
    }
  }

  async acceptBookingCompleted() {
    const { bouncer, request, params } = this.ctx
    const booking = await Booking.findOrFail(+params.id)
    await bouncer.with('BookingPolicy').authorize('update', booking)

    const payload = await request.validateUsing(requestBookingCompletionValidator)

    if (booking.status === OrderStatus.COMPLETION_REQUESTED) {
      await db.transaction(async (trx) => {
        booking.useTransaction(trx)
        booking.merge({ status: OrderStatus.COMPLETED })
        booking.history.push({
          date_time: DateTime.now(),
          event: 'Booking completed',
          remarks: payload?.remarks || '',
        })
        await booking.save()
      })

      return booking
    } else {
      return 'Invalid Request'
    }
  }

  async getBookingData(opt: {
    serviceVariantId: number
    qty: number
    couponId?: number
    alterMaxUsers: boolean
  }) {
    const serviceVariant = await ServiceVariant.findOrFail(opt?.serviceVariantId)

    await serviceVariant.load('service', (service) => {
      service
        .preload('businessProfile', (b) => {
          b.preload('vendor', (v) => {
            v.select(['id', 'first_name', 'last_name'])
          })
        })
        .preload('timeSlotPlan', (p) => p.select('id'))
        .select([
          'id',
          'delivery_options',
          'name',
          'slug',
          'geo_location',
          'km_radius',
          'avg_rating',
          'thumbnail',
          'business_profile_id',
        ])
    })

    const totalWithoutDiscount = new BigNumber(serviceVariant.price).times(opt.qty)
    let vendorDiscount = new BigNumber(0)

    if (serviceVariant.discountType === DiscountType.FLAT) {
      vendorDiscount = vendorDiscount.plus(
        new BigNumber(serviceVariant.discountFlat).times(opt?.qty)
      )
    } else if (serviceVariant.discountPercentage) {
      const percentage = new BigNumber(serviceVariant.discountPercentage)
      vendorDiscount = vendorDiscount.plus(
        percentage.dividedBy(100).times(serviceVariant.price).times(opt?.qty)
      )
    }
    const totalAfterDiscount = totalWithoutDiscount.minus(vendorDiscount)

    const couponDiscount = opt?.couponId
      ? await this.applyCoupon({
          couponId: opt?.couponId,
          total_amount: totalAfterDiscount,
          vendor_user_id: serviceVariant.service.businessProfile.vendor.id,
          alter_max_user: opt.alterMaxUsers,
        })
      : 0

    const grandTotal = totalAfterDiscount.minus(couponDiscount)

    const booking = {
      businessProfileId: serviceVariant.service.businessProfile.id,
      bookingDetail: {
        couponId: opt?.couponId,
        vendorUserId: serviceVariant.service.businessProfile.vendor.id,
        service_variant: serviceVariant,
        qty: opt?.qty,
        totalWithoutDiscount: totalWithoutDiscount.toFixed(2),
        vendorDiscount: vendorDiscount.toFixed(2),
        totalAfterDiscount: totalAfterDiscount.toFixed(2),
        couponDiscount: couponDiscount.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
      },
    }

    return booking
  }

  async applyCoupon(opt: {
    couponId: number | undefined
    total_amount: BigNumber
    vendor_user_id: number
    alter_max_user?: boolean
  }): Promise<BigNumber> {
    const coupon = await Coupon.query()
      .where('id', opt?.couponId || '')
      .preload('businessProfile', (b) => {
        b.preload('vendor').select(['id', 'user_id'])
      })
      .first()

    let coupanDiscountAmount = new BigNumber(0)

    if (coupon && opt.total_amount.gte(coupon.minPurchaseAmount)) {
      if (
        coupon?.couponType === CouponType.VENDOR &&
        coupon.businessProfile.vendor.id === opt?.vendor_user_id
      ) {
        if (coupon.discountType === DiscountType.FLAT) {
          coupanDiscountAmount = coupanDiscountAmount.plus(coupon.discountFlat)
        }

        if (coupon.discountType === DiscountType.PERCENATAGE) {
          const percentage = new BigNumber(coupon.discountPercentage)
          coupanDiscountAmount = coupanDiscountAmount.plus(
            percentage.dividedBy(100).times(opt?.total_amount)
          )
        }
      } else if (coupon.couponType === CouponType.ADMIN) {
        if (coupon.discountType === DiscountType.FLAT) {
          coupanDiscountAmount = coupanDiscountAmount.plus(coupon.discountFlat)
        }

        if (coupon.discountType === DiscountType.PERCENATAGE) {
          const percentage = new BigNumber(coupon.discountPercentage)
          coupanDiscountAmount = coupanDiscountAmount.plus(
            percentage.dividedBy(100).times(opt?.total_amount)
          )
        }
      }

      if (opt?.alter_max_user) {
        if (coupon.totalUsed < coupon.maxUsers) {
          coupon.totalUsed += 1
          await coupon.save()
        }
      }
    }

    return coupanDiscountAmount
  }
}
