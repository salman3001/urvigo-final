import { CouponType, DiscountType, OrderStatus, userTypes } from '#helpers/enums'
import Booking from '#models/booking'
import Coupon from '#models/coupon'
import ServiceVariant from '#models/service_variant'
import {
  BookingSummaryValidator,
  CreateBookingValidator,
  UpdateBookingStatusValidator,
} from '#validators/booking'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import config from '@adonisjs/core/services/config'
import { BigNumber } from 'bignumber.js'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class BookingService {
  constructor(protected ctx: HttpContext) {}

  async index() {
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

    return await bookingQuery.paginate(
      request.qs()?.page || 1,
      request.qs()?.perPage || config.get('common.rowsPerPage')
    )
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
    const booking = await Booking.query().where('id', id).firstOrFail()

    await bouncer.with('BookingPolicy').authorize('view', booking)

    return booking
  }

  async summary() {
    const { bouncer, request } = this.ctx
    await bouncer.with('BookingPolicy').authorize('create')
    const payload = await request.validateUsing(BookingSummaryValidator)
    return await this.getBookingData(payload.serviceVariantId, payload.qty, payload?.couponId)
  }

  async store() {
    const { bouncer, request, auth } = this.ctx
    await bouncer.with('BookingPolicy').authorize('create')
    const payload = await request.validateUsing(CreateBookingValidator)
    const booking = await this.getBookingData(
      payload.serviceVariantId,
      payload.qty,
      payload?.couponId
    )

    return await Booking.create({
      userId: auth.user!.id,
      status: OrderStatus.PLACED,
      history: [
        {
          date_time: DateTime.now(),
          event: 'Order Placed',
          remarks: '',
        },
      ],
      paymentDetail: payload.paymentdetail,
      ...booking,
    })
  }

  async updateStatus() {
    const { bouncer, request, params } = this.ctx
    const booking = await Booking.findOrFail(+params.id)
    await bouncer.with('BookingPolicy').authorize('update', booking)

    const payload = await request.validateUsing(UpdateBookingStatusValidator)

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

    await booking.refresh()

    return booking
  }

  async getBookingData(serviceVariantId: number, qty: number, couponId?: number) {
    const serviceVariant = await ServiceVariant.findOrFail(serviceVariantId)

    await serviceVariant.load('service', (service) => {
      service.preload('businessProfile', (b) => {
        b.preload('vendor', (v) => {
          v.select(['id', 'first_name', 'last_name'])
        })
      })
    })

    const totalWithoutDiscount = new BigNumber(serviceVariant.price).times(qty)
    let vendorDiscount = new BigNumber(0)

    if (serviceVariant.discountType === DiscountType.FLAT) {
      vendorDiscount = vendorDiscount.plus(new BigNumber(serviceVariant.discountFlat).times(qty))
    } else if (serviceVariant.discountPercentage) {
      const percentage = new BigNumber(serviceVariant.discountPercentage)
      vendorDiscount = vendorDiscount.plus(
        percentage.dividedBy(100).times(serviceVariant.price).times(qty)
      )
    }
    const totalAfterDiscount = totalWithoutDiscount.minus(vendorDiscount)

    const couponDiscount = couponId
      ? await this.applyCoupon(
          couponId,
          totalAfterDiscount,
          serviceVariant.service.businessProfile.vendor.id
        )
      : 0

    const grandTotal = totalAfterDiscount.minus(couponDiscount)

    const booking = {
      businessProfileId: serviceVariant.service.businessProfile.id,
      bookingDetail: {
        couponId,
        vendorUserId: serviceVariant.service.businessProfile.vendor.id,
        service_variant: serviceVariant,
        qty: qty,
        totalWithoutDiscount: totalWithoutDiscount.toFixed(2),
        vendorDiscount: vendorDiscount.toFixed(2),
        totalAfterDiscount: totalAfterDiscount.toFixed(2),
        couponDiscount: couponDiscount.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
      },
    }

    return booking
  }

  async applyCoupon(
    couponId: number | undefined,
    total_amount: BigNumber,
    vendor_user_id: number
  ): Promise<BigNumber> {
    const coupon = await Coupon.query()
      .where('id', couponId || '')
      .preload('businessProfile', (b) => {
        b.preload('vendor').select(['id'])
      })
      .first()

    let coupanDiscountAmount = new BigNumber(0)

    if (coupon) {
      if (
        coupon?.couponType === CouponType.VENDOR &&
        coupon.businessProfile.vendor.id === vendor_user_id
      ) {
        if (coupon.discountType === DiscountType.FLAT) {
          coupanDiscountAmount = coupanDiscountAmount.plus(coupon.discountFlat)
        }

        if (coupon.discountType === DiscountType.PERCENATAGE) {
          const percentage = new BigNumber(coupon.discountPercentage)
          coupanDiscountAmount = coupanDiscountAmount.plus(
            percentage.dividedBy(100).times(total_amount)
          )
        }
      } else if (coupon.couponType === CouponType.ADMIN) {
        if (coupon.discountType === DiscountType.FLAT) {
          coupanDiscountAmount = coupanDiscountAmount.plus(coupon.discountFlat)
        }

        if (coupon.discountType === DiscountType.PERCENATAGE) {
          const percentage = new BigNumber(coupon.discountPercentage)
          coupanDiscountAmount = coupanDiscountAmount.plus(
            percentage.dividedBy(100).times(total_amount)
          )
        }
      }
    }

    return coupanDiscountAmount
  }
}
