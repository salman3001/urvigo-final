import type { HttpContext } from '@adonisjs/core/http'
import ReviewsService from '../../services/review_service.js'
import { inject } from '@adonisjs/core'

@inject()
export default class ApiReviewsController {
  constructor(protected reviewService: ReviewsService) {}

  async getServiceReviews({ response }: HttpContext) {
    const reviews = await this.reviewService.getServiceReviews()
    return response.custom({
      code: 200,
      data: reviews,
      message: null,
      success: true,
    })
  }

  async getServiceReviewsInfo({ response }: HttpContext) {
    const info = await this.reviewService.serviceReviewsInfo()
    return response.custom({
      code: 200,
      data: info,
      message: null,
      success: true,
    })
  }

  async getVendorReviews({ response }: HttpContext) {
    const reviews = await this.reviewService.getVendorReviews()
    return response.custom({
      code: 200,
      data: reviews,
      message: null,
      success: true,
    })
  }

  async getVendorReviewsInfo({ response }: HttpContext) {
    const info = await this.reviewService.vendorReviewsInfo()
    return response.custom({
      code: 200,
      data: info,
      message: null,
      success: true,
    })
  }

  async createServiceReview({ response }: HttpContext) {
    const data = await this.reviewService.createServiceReview()
    if (data === 'Already Exist') {
      return response.custom({
        code: 400,
        data: null,
        message: 'Review already exits',
        success: true,
      })
    } else {
      return response.custom({
        code: 200,
        data: data,
        message: 'Review Created',
        success: true,
      })
    }
  }

  async createVendorReview({ response }: HttpContext) {
    const data = await this.reviewService.createVendorReview()
    if (data === 'Already Exist') {
      return response.custom({
        code: 400,
        data: null,
        message: 'Review already exits',
        success: true,
      })
    } else {
      return response.custom({
        code: 200,
        data: data,
        message: 'Review Created',
        success: true,
      })
    }
  }
}
