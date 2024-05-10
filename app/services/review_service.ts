import { paginate } from '#helpers/common'
import { ServiceReviewsInfo, VendorReviewsInfo } from '#helpers/types'
import Review from '#models/review'
import VendorReview from '#models/vendor_review'
import { CreateReviewValidator, CreateVendorReviewValidator } from '#validators/reviews_validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { BigNumber } from 'bignumber.js'

@inject()
export default class ReviewsService {
  constructor(protected ctx: HttpContext) {}

  async getVendorReviews() {
    const { params, request } = this.ctx
    const reviewsQuery = VendorReview.query().where(
      'business_profile_id',
      +params.businessProfileId
    )

    const reviews = await paginate(reviewsQuery, request)

    return reviews
  }

  async vendorReviewsInfo(): Promise<VendorReviewsInfo> {
    const { params } = this.ctx

    const result = await db.rawQuery(
      `
      SELECT 
        COUNT(*) AS total, 
        AVG(avg_rating) AS total_avg_rating, 
        AVG(response_time) AS avg_response_time, 
        AVG(quality_of_service) AS avg_quality_of_service, 
        AVG(professional_behavior) AS avg_professional_behavior, 
        AVG(communication) AS avg_communication, 
        AVG(fair_pricing) AS avg_fair_pricing, 
        COUNT(CASE WHEN avg_rating BETWEEN 4 AND 5 THEN 1 END) AS five_star_count,
        COUNT(CASE WHEN avg_rating BETWEEN 3 AND 4 THEN 1 END) AS four_star_count,
        COUNT(CASE WHEN avg_rating BETWEEN 2 AND 3 THEN 1 END) AS three_star_count,
        COUNT(CASE WHEN avg_rating BETWEEN 1 AND 2 THEN 1 END) AS two_star_count,
        COUNT(CASE WHEN avg_rating BETWEEN 0 AND 1 THEN 1 END) AS one_star_count
      FROM 
        vendor_reviews 
      WHERE 
      business_profile_id = ?
      `,
      [+params.businessProfileId]
    )

    const totalReviews = result?.rows[0]?.total || 0
    const totalAvgRating = new BigNumber(result?.rows[0]?.total_avg_rating || 0).toFixed(1)
    const avgResponseTime = new BigNumber(result?.rows[0]?.avg_response_time || 0).toFixed(1)
    const avgQualityOfService = new BigNumber(result?.rows[0]?.avg_quality_of_service || 0).toFixed(
      1
    )
    const avgProfessionalBehavior = new BigNumber(
      result?.rows[0]?.avg_professional_behavior || 0
    ).toFixed(1)
    const avgCommunication = new BigNumber(result?.rows[0]?.avg_communication || 0).toFixed(1)
    const avgFairPricing = new BigNumber(result?.rows[0]?.avg_fair_pricing || 0).toFixed(1)
    const fiveStarCount = result?.rows[0]?.five_star_count || 0
    const fourStarCount = result?.rows[0]?.four_star_count || 0
    const threeStarCount = result?.rows[0]?.three_star_count || 0
    const twoStarCount = result?.rows[0]?.two_star_count || 0
    const oneStarCount = result?.rows[0]?.one_star_count || 0

    return {
      avgRating: totalAvgRating,
      avgCommunication,
      avgFairPricing,
      avgProfessionalBehavior,
      avgQualityOfService,
      avgResponseTime,
      totalReviews,
      counts: [
        {
          rating: 5,
          value: fiveStarCount,
        },
        {
          rating: 4,
          value: fourStarCount,
        },
        {
          rating: 3,
          value: threeStarCount,
        },
        {
          rating: 2,
          value: twoStarCount,
        },
        {
          rating: 1,
          value: oneStarCount,
        },
      ],
    }
  }

  async getServiceReviews() {
    const { params, request } = this.ctx
    console.log(+params.serviceId)
    console.log('here')

    const reviewsQuery = Review.query().where('service_id', +params.serviceId)

    const reviews = await paginate(reviewsQuery, request)

    return reviews
  }

  async serviceReviewsInfo(): Promise<ServiceReviewsInfo> {
    const { params } = this.ctx

    const result = await db.rawQuery(
      `
      SELECT 
        COUNT(*) AS total, 
        AVG(rating) AS avg_rating, 
        COUNT(CASE WHEN rating = 5 THEN 1 END) AS five_star_count,
        COUNT(CASE WHEN rating = 4 THEN 1 END) AS four_star_count,
        COUNT(CASE WHEN rating = 3 THEN 1 END) AS three_star_count,
        COUNT(CASE WHEN rating = 2 THEN 1 END) AS two_star_count,
        COUNT(CASE WHEN rating = 1 THEN 1 END) AS one_star_count
      FROM 
        reviews 
      WHERE 
      service_id = ?
      `,
      [+params.serviceId]
    )

    const totalReviews = result?.rows[0]?.total || 0
    const avgRating = new BigNumber(result?.rows[0]?.avg_rating || 0).toFixed(1)
    const fiveStarCount = result?.rows[0]?.five_star_count || 0
    const fourStarCount = result?.rows[0]?.four_star_count || 0
    const threeStarCount = result?.rows[0]?.three_star_count || 0
    const twoStarCount = result?.rows[0]?.two_star_count || 0
    const oneStarCount = result?.rows[0]?.one_star_count || 0

    return {
      avgRating,
      totalReviews,
      counts: [
        {
          rating: 5,
          value: fiveStarCount,
        },
        {
          rating: 4,
          value: fourStarCount,
        },
        {
          rating: 3,
          value: threeStarCount,
        },
        {
          rating: 2,
          value: twoStarCount,
        },
        {
          rating: 1,
          value: oneStarCount,
        },
      ],
    }
  }

  async createVendorReview() {
    const { request, bouncer, auth, params } = this.ctx
    await bouncer.with('ReviewPolicy').authorize('create')

    const user = auth.user
    const businessProfileId = params.businessProfileId

    const reviewExist = await VendorReview.query()
      .where('business_profile_id', businessProfileId)
      .where('user_id', auth.user!.id)
      .first()

    if (reviewExist) {
      return 'Already Exist'
    }

    const payload = await request.validateUsing(CreateVendorReviewValidator)

    const avgRating = new BigNumber(payload.responseTime)
      .plus(payload.qualityOfService)
      .plus(payload.professionalBehavior)
      .plus(payload.communication)
      .plus(payload.fairPricing)
      .dividedBy(5)
      .toFixed(1)

    const review = await VendorReview.create({
      ...payload,
      businessProfileId: businessProfileId,
      userId: user!.id,
      avgRating,
    })
    return review
  }

  async createServiceReview() {
    const { request, bouncer, params, auth } = this.ctx
    await bouncer.with('ReviewPolicy').authorize('create')
    const user = auth.user
    const serviceId = params.serviceId

    const reviewExist = await Review.query()
      .where('service_id', serviceId)
      .where('user_id', auth.user!.id)
      .first()

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
