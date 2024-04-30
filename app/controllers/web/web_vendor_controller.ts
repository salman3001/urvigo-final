import ServiceCategoryService from '#services/service_category_service'
import ServiceService from '#services/service_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import ServiceSubategoryService from '../../services/service_subcategory_service.js'
import ServiceTagService from '../../services/service_tag_service.js'
import BookingService from '../../services/booking_service.js'
import BidBookingService from '../../services/bid_booking_service.js'
import ServiceRequirementService from '../../services/service_requirement_service.js'
import BidService from '../../services/bid_service.js'
import CouponService from '../../services/coupon_service.js'

@inject()
export default class WebVendorController {
  constructor(
    protected serviceService: ServiceService,
    protected categoryService: ServiceCategoryService,
    protected subcategoryService: ServiceSubategoryService,
    protected tagService: ServiceTagService,
    protected bookingService: BookingService,
    protected bidbookingService: BidBookingService,
    protected requirementService: ServiceRequirementService,
    protected bidService: BidService,
    protected couponService: CouponService
  ) {}

  async dashboard({ inertia }: HttpContext) {
    return inertia.render('vendor/dashboard')
  }

  async serviceIndex({ inertia }: HttpContext) {
    return inertia.render('vendor/services/service-index', {
      services: () => this.serviceService.myList(),
      categories: () => this.categoryService.index(),
      subcategories: () => this.subcategoryService.index(),
      tags: () => this.tagService.index(),
    })
  }

  async serviceShow({ inertia }: HttpContext) {
    return inertia.render('vendor/services/service-show', {
      service: () => this.serviceService.showBySlug(),
    })
  }

  async serviceCreate({ inertia }: HttpContext) {
    return inertia.render('vendor/services/service-create', {
      categories: () => this.categoryService.index(),
      subcategories: () => this.subcategoryService.index(),
      tags: () => this.tagService.index(),
    })
  }

  async serviceCreatePost({ response, session }: HttpContext) {
    await this.serviceService.store()
    session.flash('flash', {
      message: 'Service Created',
      type: 'success',
    })
    return response.redirect().toRoute('vendor.service.index')
  }

  async serviceEdit({ inertia }: HttpContext) {
    return inertia.render('vendor/services/service-edit', {
      service: () => this.serviceService.showBySlug(),
      categories: () => this.categoryService.index(),
      subcategories: () => this.subcategoryService.index(),
      tags: () => this.tagService.index(),
    })
  }

  async serviceEditPost({ response, session }: HttpContext) {
    await this.serviceService.update()
    session.flash('flash', {
      message: 'Service Updated',
      type: 'success',
    })
    return response.redirect().toRoute('vendor.service.index')
  }

  async serviceDelete({ response, session }: HttpContext) {
    await this.serviceService.destroy()
    session.flash('flash', {
      message: 'Service Deleted',
      type: 'success',
    })
    return response.redirect().toRoute('vendor.service.index')
  }

  async serviceImageDelete({ response, session }: HttpContext) {
    await this.serviceService.deleteImages()
    session.flash('flash', {
      message: 'Image Deleted',
      type: 'success',
    })
    return response.redirect().back()
  }

  async bookingIndex({ inertia }: HttpContext) {
    return inertia.render('vendor/bookings/booking-index', {
      bookings: () => this.bookingService.myList(),
    })
  }

  async bookingShow({ inertia }: HttpContext) {
    return inertia.render('vendor/bookings/booking-show', {
      bookings: () => this.bookingService.show(),
    })
  }

  async customBookingIndex({ inertia }: HttpContext) {
    return inertia.render('vendor/custom-bookings/custom-booking-index', {
      bookings: () => this.bidbookingService.myList(),
    })
  }

  async customBookingShow({ inertia }: HttpContext) {
    return inertia.render('vendor/custom-bookings/custom-booking-show', {
      bookings: () => this.bidbookingService.show(),
    })
  }

  async requirementIndex({ inertia }: HttpContext) {
    return inertia.render('vendor/requirements/requirement-index', {
      requirements: () => this.requirementService.listForVendor(),
    })
  }

  async requirementShow({ inertia }: HttpContext) {
    return inertia.render('vendor/requirements/requirement-show', {
      requirement: () => this.requirementService.show(),
      placedBid: () => this.requirementService.showVendorPlacedbid(),
    })
  }

  async createBid({ response, session }: HttpContext) {
    const data = await this.bidService.store()
    if (data === 'proposal exist') {
      session.flash('flash', {
        message: 'You have already placed bid',
        type: 'error',
      })
      return response.redirect().back()
    } else {
      session.flash('flash', {
        message: 'Bid Placed',
        type: 'success',
      })
      return response.redirect().back()
    }
  }

  async acceptNegotiation({ response, session }: HttpContext) {
    const data = await this.bidService.acceptNegotiation()
    if (data === 'Negotiation Not Requested') {
      session.flash('flash', {
        message: 'You have already placed bid',
        type: 'error',
      })
      return response.redirect().back()
    } else {
      session.flash('flash', {
        message: 'Negotiation accepted and bid price updated',
        type: 'success',
      })
      return response.redirect().back()
    }
  }

  async myBids({ inertia }: HttpContext) {
    return inertia.render('vendor/my-bids/my-bid-index', {
      bids: () => this.bidService.index(),
    })
  }

  async couponsIndex({ inertia }: HttpContext) {
    return inertia.render('vendor/coupons/coupon-index', {
      coupons: () => this.couponService.vendorCoupons(),
    })
  }

  async couponsShow({ inertia }: HttpContext) {
    return inertia.render('vendor/coupons/coupon-show', {
      coupon: () => this.couponService.show(),
    })
  }

  async couponsCreate({ inertia }: HttpContext) {
    return inertia.render('vendor/coupons/coupon-create', {
      services: () => this.serviceService.myAllList(),
    })
  }

  async couponsCreatePost({ response, session }: HttpContext) {
    await this.couponService.store()
    session.flash('flash', {
      type: 'success',
      message: 'Coupon cretaed',
    })
    return response.redirect().toRoute('vendor.coupon.index')
  }

  async couponsEdit({ inertia }: HttpContext) {
    return inertia.render('vendor/coupons/coupon-edit', {
      coupon: () => this.couponService.show(),
    })
  }

  async couponsEditPost({ response, session }: HttpContext) {
    await this.couponService.update()
    session.flash('flash', {
      type: 'success',
      message: 'Coupon Updated',
    })
    return response.redirect().toRoute('vendor.coupon.index')
  }

  async couponsDelete({ response, session }: HttpContext) {
    await this.couponService.destroy()
    session.flash('flash', {
      message: 'Coupon Deleted',
      type: 'success',
    })
    return response.redirect().toRoute('vendor.coupon.index')
  }
}
