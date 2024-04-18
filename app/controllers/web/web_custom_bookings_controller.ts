import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import BidBookingService from '#services/bid_booking_service'

@inject()
export default class WebCustomBookingsController {
  constructor(protected bidBookingService: BidBookingService) {}

  async index({ inertia }: HttpContext) {
    return inertia.render('bookings/booking-list', {
      bookings: () => this.bidBookingService.index(),
    })
  }

  async show({ inertia }: HttpContext) {
    return inertia.render('bookings/booking-show', {
      booking: () => this.bidBookingService.show(),
    })
  }

  async summary({ inertia }: HttpContext) {
    return inertia.render('bookings/checkout/booking-summary')
  }
}
