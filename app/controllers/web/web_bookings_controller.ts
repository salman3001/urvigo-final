import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import BookingService from '#services/booking_service'
import CouponService from '../../services/coupon_service.js'

@inject()
export default class WebBookingsController {
  constructor(protected bookingService: BookingService,protected couponService:CouponService) {}

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
    session.put('booking-summary',summary) 
    return inertia.render('bookings/checkout/booking-summary', {
      summary,
      couponList:inertia.lazy(()=>this.couponService.index())
    })
  }

  async address({ inertia,session,response}: HttpContext) {   
    const summary = session.get('booking-summary') 

    if(!summary){
      response.badRequest('Bad Request')
    }
    
    return inertia.render('bookings/checkout/booking-address', {
      summary,
    })
  }

  async payment({ inertia,session,response}: HttpContext) {    
    const summary = session.get('booking-summary') 

    if(!summary){
      response.badRequest('Bad Request')
    }
    
    return inertia.render('bookings/checkout/booking-payment', {
      summary,
    })
  }

  async createBooking({ response,session}: HttpContext) {
    session.flash({
      message:'Booking Created',
      type:'success'
    })  
    await this.bookingService.store()
    return response.redirect().toRoute('web.booking.confirmation')
  }

  async confirmation({ inertia,session,response}: HttpContext) {  
    const summary = session.get('booking-summary') 

    if(!summary){
      response.badRequest('Bad Request')
    }

    session.forget('booking-summary')

    return inertia.render('bookings/checkout/booking-confirmation', {
      summary,
    })
  }


}
