import { DateTime } from 'luxon'
import { BaseModel, afterCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import BusinessProfile from './business_profile.js'
import { BigNumber } from 'bignumber.js'

export default class VendorReview extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({
    serialize: (v) => new BigNumber(v || 0).toFixed(1),
  })
  declare responseTime: number

  @column({
    serialize: (v) => new BigNumber(v || 0).toFixed(1),
  })
  declare qualityOfService: number

  @column({
    serialize: (v) => new BigNumber(v || 0).toFixed(1),
  })
  declare professionalBehavior: number

  @column({
    serialize: (v) => new BigNumber(v || 0).toFixed(1),
  })
  declare communication: number

  @column({
    serialize: (v) => new BigNumber(v || 0).toFixed(1),
  })
  declare fairPricing: number

  @column({
    serialize: (v) => new BigNumber(v || 0).toFixed(1),
  })
  declare avgRating: number | string

  @column()
  declare message: string

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare businessProfileId: number

  @belongsTo(() => BusinessProfile)
  declare businessProfile: BelongsTo<typeof BusinessProfile>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterCreate()
  static async setAvgRating(review: VendorReview) {
    if (review.businessProfileId) {
      const profile = await BusinessProfile.query()
        .where('id', review.businessProfileId)
        .withAggregate('reviews', (b) => {
          b.avg('avg_rating').as('total_avg_rating')
        })
        .first()

      if (profile) {
        profile.avgRating = new BigNumber(profile.$extras?.response_time_avg || 0).toFixed(1)
        await profile.save()
      }
    }
  }
}

// if (review.businessProfileId) {
//   const profile = await BusinessProfile.query()
//     .where('id', review.businessProfileId)
//     .withAggregate('reviews', (b) => {
//       b.avg('response_time').as('response_time_avg')
//       b.avg('quality_of_service').as('quality_of_service_avg')
//       b.avg('professional_behavior').as('professional_behavior_avg')
//       b.avg('communication').as('communication_avg')
//       b.avg('fair_pricing').as('fair_pricing_avg')
//     })
//     .first()

//   if (profile) {
//     const rsAvg = new BigNumber(profile.$extras?.response_time_avg || 0)
//     const qosAvg = new BigNumber(profile.$extras?.quality_of_service_avg || 0)
//     const pbAvg = new BigNumber(profile.$extras?.professional_behavior_avg || 0)
//     const comAvg = new BigNumber(profile.$extras?.communication_avg || 0)
//     const fpAvg = new BigNumber(profile.$extras?.fair_pricing_avg || 0)
//     const sum = rsAvg.plus(qosAvg).plus(pbAvg).plus(comAvg).plus(fpAvg)
//     const finalAvg = sum.dividedBy(5).toFixed(1)
//     profile.avgRating = finalAvg
//     await profile.save()
//   }
