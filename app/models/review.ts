import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import BusinessProfile from './business_profile.js'
import Service from './service.js'
import { BigNumber } from 'bignumber.js'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({
    serialize: (v) => new BigNumber(v || 0).toFixed(1),
  })
  declare rating: number

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

  @column()
  declare serviceId: number

  @belongsTo(() => Service)
  declare service: BelongsTo<typeof Service>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // @afterCreate()
  // declare static async setAvgRating(review: Review) {
  //   if (review.serviceId) {
  //     const service = await Service.query()
  //       .where('id', review.serviceId)
  //       .withAggregate('reviews', (b) => {
  //         b.avg('rating').as('service_avg_rating')
  //       })
  //       .first()

  //     if (service) {
  //       const avg_rating = new BigNumber(service.$extras?.service_avg_rating || 0).toFixed(1)
  //       service.avgRating = avg_rating
  //       await service.save()

  //       const vendor = await VendorUser.query()
  //         .where('id', service.vendorUserId)
  //         .withAggregate('services', (s) => {
  //           s.avg('avg_rating').as('service_avg_rating')
  //         })
  //         .withAggregate('reviews', (b) => {
  //           b.avg('rating').as('vendor_avg_rating')
  //         })
  //         .first()

  //       if (vendor) {
  //         const avg_rating = new BigNumber(vendor.$extras?.service_avg_rating || 0)
  //           .plus(vendor.$extras?.vendor_avg_rating || 0)
  //           .dividedBy(2)
  //           .toFixed(1)

  //         vendor.avgRating = avg_rating
  //         await vendor.save()
  //       }
  //     }
  //   }

  //   if (review.vendorUserId) {
  //     const vendor = await VendorUser.query()
  //       .where('id', review.vendorUserId)
  //       .withAggregate('services', (s) => {
  //         s.avg('avg_rating').as('service_avg_rating')
  //       })
  //       .withAggregate('reviews', (b) => {
  //         b.avg('rating').as('vendor_avg_rating')
  //       })
  //       .first()

  //     if (vendor) {
  //       const avg_rating = new BigNumber(vendor.$extras?.service_avg_rating || 0)
  //         .plus(vendor.$extras?.vendor_avg_rating || 0)
  //         .dividedBy(2)
  //         .toFixed(1)

  //       vendor.avgRating = avg_rating
  //       await vendor.save()
  //     }
  //   }
  // }
}
