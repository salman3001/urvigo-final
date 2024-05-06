import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import BookingService from '#services/booking_service'
import CouponService from '../../services/coupon_service.js'
import vine from '@vinejs/vine'
import { DeliveryOptions, PaymentMode, PaymentStatus } from '#helpers/enums'

@inject()
export default class WebBookingsController {
  constructor(
    protected bookingService: BookingService,
    protected couponService: CouponService
  ) {}

  async index({ inertia }: HttpContext) {
    return inertia.render('bookings/booking-list', {
      bookings: () => this.bookingService.myList(),
    })
  }

  async show({ inertia }: HttpContext) {
    return inertia.render('bookings/booking-show', {
      booking: () => this.bookingService.show(),
    })
  }

  async summary({ inertia, session }: HttpContext) {
    const summary = await this.bookingService.summary()
    session.put('booking-summary', summary)
    return inertia.render('bookings/checkout/booking-summary', {
      summary,
      couponList: inertia.lazy(() => this.couponService.aplicableCoupons()),
    })
  }

  async address({ inertia, session, response }: HttpContext) {
    const summary = session.get('booking-summary')

    if (!summary) {
      session.flash('flash', {
        message: 'Seshion Expired',
        type: 'error',
      })

      return response.redirect().toRoute('web.home')
    }

    return inertia.render('bookings/checkout/booking-address', {
      summary,
    })
  }

  async addressPost({ session, response, request }: HttpContext) {
    let summary = session.get('booking-summary')

    if (!summary) {
      session.flash('flash', {
        message: 'Seshion Expired',
        type: 'error',
      })

      return response.redirect().toRoute('web.home')
    }

    const validationSchema = vine.compile(
      vine.object({
        addressDetail: vine.object({
          address: vine.string().optional(),
          mapAddress: vine.string(),
          mobile: vine.string(),
          geoLocation: vine.string(),
        }),
        deliveryType: vine.enum(DeliveryOptions),
      })
    )

    const payload = await request.validateUsing(validationSchema)
    session.put('booking-summary.addressDetail', payload.addressDetail)
    session.put('booking-summary.deliveryType', payload.deliveryType)

    return response.redirect().toRoute('web.booking.payment')
  }

  async payment({ inertia, session, response }: HttpContext) {
    let summary = session.get('booking-summary')

    if (!summary) {
      session.flash('flash', {
        message: 'Seshion Expired',
        type: 'error',
      })

      return response.redirect().toRoute('web.home')
    }

    return inertia.render('bookings/checkout/booking-payment', {
      summary,
    })
  }

  async paymentPost({ session, response, request }: HttpContext) {
    let summary = session.get('booking-summary')

    if (!summary) {
      session.flash('flash', {
        message: 'Seshion Expired',
        type: 'error',
      })

      return response.redirect().toRoute('web.home')
    }

    const validationSchema = vine.compile(
      vine.object({
        paymentDetail: vine.object({
          paymentMode: vine.enum(PaymentMode),
          paymentStatus: vine.enum(PaymentStatus),
        }),
      })
    )

    const payload = await request.validateUsing(validationSchema)

    session.put('booking-summary.paymentDetail', payload.paymentDetail)

    return response.redirect().toRoute('web.booking.create')
  }

  async createBooking({ response, session }: HttpContext) {
    const bookingSummary = session.get('booking-summary')

    if (!bookingSummary) {
      session.flash('flash', {
        message: 'Seshion Expired',
        type: 'error',
      })

      return response.redirect().toRoute('web.home')
    }
    await this.bookingService.store()
    session.flash('flash', {
      message: 'Booking Created',
      type: 'success',
    })
    return response.redirect().toRoute('web.booking.confirmation')
  }

  async confirmation({ inertia, session, response }: HttpContext) {
    const summary = session.get('booking-summary')

    if (!summary) {
      response.badRequest('Bad Request')
    }

    session.forget('booking-summary')

    return inertia.render('bookings/checkout/booking-confirmation', {
      summary,
    })
  }
}

export type IWebBookingController = WebBookingsController
