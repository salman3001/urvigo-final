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

  async getVendorReviews({ response }: HttpContext) {
    const reviews = await this.reviewService.getVendorReviews()
    return response.custom({
      code: 200,
      data: reviews,
      message: null,
      success: true,
    })
  }

  async createServiceReview({ response }: HttpContext) {
    const reviews = await this.reviewService.createServiceReview()
    return response.custom({
      code: 200,
      data: reviews,
      message: 'Review Creaed',
      success: true,
    })
  }

  async createVendorReview({ response }: HttpContext) {
    const reviews = await this.reviewService.createVendorReview()
    return response.custom({
      code: 200,
      data: reviews,
      message: 'Review Creaed',
      success: true,
    })
  }
}
