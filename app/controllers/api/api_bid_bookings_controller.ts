import type { HttpContext } from '@adonisjs/core/http'
import BidBookingService from '../../services/bid_booking_service.js'
import { inject } from '@adonisjs/core'

@inject()
export default class ApiBidBookingsController {
  constructor(protected bidBookingService: BidBookingService) {}

  async index({ response }: HttpContext) {
    const bookings = await this.bidBookingService.index()
    return response.custom({
      code: 200,
      data: bookings,
      message: null,
      success: true,
    })
  }

  async myList({ response }: HttpContext) {
    const booking = await this.bidBookingService.myList()
    return response.custom({
      code: 200,
      data: booking,
      message: null,
      success: true,
    })
  }

  async show({ response }: HttpContext) {
    const booking = await this.bidBookingService.show()
    return response.custom({
      code: 200,
      data: booking,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const booking = await this.bidBookingService.store()
    return response.custom({
      code: 200,
      data: booking,
      message: 'Booking Created',
      success: true,
    })
  }

  async updateStatus({ response }: HttpContext) {
    const booking = await this.bidBookingService.updateStatus()
    return response.custom({
      code: 200,
      data: booking,
      message: 'Status Updated',
      success: true,
    })
  }
}
