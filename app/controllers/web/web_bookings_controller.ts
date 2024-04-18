import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import BookingService from '#services/booking_service'

@inject()
export default class WebBookingsController {
  constructor(protected bookingService: BookingService) {}

  async index({ inertia }: HttpContext) {
    return inertia.render('bookings/booking-list', {
      bookings: () => this.bookingService.index(),
    })
  }

  async show({ inertia }: HttpContext) {
    return inertia.render('bookings/booking-show', {
      booking: () => this.bookingService.show(),
    })
  }

  async summary({ inertia }: HttpContext) {
    return inertia.render('bookings/checkout/booking-summary', {
      summary: () => this.bookingService.summary(),
      meta: {
        salman: 'khan',
      },
    })
  }
}
