import { DateTime } from 'luxon'
import { BaseModel, afterCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
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
  declare serviceId: number

  @belongsTo(() => Service)
  declare service: BelongsTo<typeof Service>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterCreate()
  static async setAvgRating(review: Review) {
    if (review.serviceId) {
      const service = await Service.query()
        .where('id', review.serviceId)
        .withAggregate('reviews', (b) => {
          b.avg('rating').as('service_avg_rating')
        })
        .first()

      if (service) {
        const avgRating = new BigNumber(service.$extras?.service_avg_rating || 0).toFixed(1)
        service.avgRating = avgRating
        await service.save()
      }
    }
  }
}

export type IReview = Review
