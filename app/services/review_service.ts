import { paginate } from '#helpers/common'
import Review from '#models/review'
import { CreateReviewValidator } from '#validators/reviews_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ReviewsService {
  constructor(protected ctx: HttpContext) {}

  async getVendorReviews() {
    const { params, request } = this.ctx
    const reviewsQuery = Review.query().whereHas('businessProfile', (b) => {
      b.whereHas('vendor', (v) => {
        v.where('id', params.vendorId)
      })
    })

    const reviews = await paginate(reviewsQuery, request)

    return reviews
  }

  async getServiceReviews() {
    const { params, request } = this.ctx
    const reviewsQuery = Review.query().whereHas('service', (s) => {
      s.where('id', params.serviceId)
    })

    const reviews = await paginate(reviewsQuery, request)

    return reviews
  }

  async createVendorReview() {
    const { request, bouncer, auth, params } = this.ctx
    await bouncer.with('ReviewPolicy').authorize('create')

    const user = auth.user
    const businessProfileId = params.id

    const reviewExist = await Review.query().whereHas('businessProfile', (v) => {
      v.where('id', businessProfileId)
    })

    if (reviewExist) {
      return 'Already Exist'
    }

    const payload = await request.validateUsing(CreateReviewValidator)

    const review = await Review.create({
      ...payload,
      businessProfileId: businessProfileId,
      userId: user!.id,
    })
    return review
  }

  async createServiceReview() {
    const { request, bouncer, params, auth } = this.ctx
    await bouncer.with('ReviewPolicy').authorize('create')
    const user = auth.user
    const serviceId = params.id

    const reviewExist = await Review.query().whereHas('service', (s) => {
      s.where('id', serviceId)
    })

    if (reviewExist) {
      return 'Already Exist'
    }

    const payload = await request.validateUsing(CreateReviewValidator)

    const review = await Review.create({
      ...payload,
      serviceId: serviceId,
      userId: user!.id,
    })
    return review
  }
}
