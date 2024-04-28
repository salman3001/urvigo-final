import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import BidBookingService from '#services/bid_booking_service'

@inject()
export default class WebCustomBookingsController {
  constructor(protected bidBookingService: BidBookingService) {}

  async index({ inertia }: HttpContext) {
    return inertia.render('custom-bookings/custom-booking-list', {
      bookings: () => this.bidBookingService.myList(),
    })
  }

  async show({ inertia }: HttpContext) {
    return inertia.render('custom-bookings/custom-booking-show', {
      booking: () => this.bidBookingService.show(),
    })
  }

  async summary({ inertia }: HttpContext) {
    return inertia.render('custom-bookings/checkout/custom-booking-summary')
  }

  async createBooking({ response, session }: HttpContext) {
    await this.bidBookingService.store()
    session.flash('flash', {
      message: 'Booking created',
      type: 'success',
    })
    return response.redirect().back()
  }
}
