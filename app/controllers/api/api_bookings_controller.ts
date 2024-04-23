import type { HttpContext } from '@adonisjs/core/http'
import BookingService from '../../services/booking_service.js'
import { inject } from '@adonisjs/core'

@inject()
export default class ApiBookingsController {
  constructor(protected bookingService: BookingService) {}

  async index({ response }: HttpContext) {
    const bookings = await this.bookingService.index()
    return response.custom({
      code: 200,
      data: bookings,
      message: null,
      success: true,
    })
  }

  async myList({ response }: HttpContext) {
    const bookings = await this.bookingService.myList()
    return response.custom({
      code: 200,
      data: bookings,
      message: null,
      success: true,
    })
  }

  async show({ response }: HttpContext) {
    const booking = await this.bookingService.show()
    return response.custom({
      code: 200,
      data: booking,
      message: null,
      success: true,
    })
  }

  async summary({ response }: HttpContext) {
    const summary = await this.bookingService.summary()
    return response.custom({
      code: 200,
      data: summary,
      message: null,
      success: true,
    })
  }

  async store({ response }: HttpContext) {
    const booking = await this.bookingService.store()
    return response.custom({
      code: 200,
      data: booking,
      message: 'Booking Created',
      success: true,
    })
  }

  async updateStatus({ response }: HttpContext) {
    const booking = await this.bookingService.updateStatus()
    return response.custom({
      code: 200,
      data: booking,
      message: 'Booking Status Updated',
      success: true,
    })
  }
}
