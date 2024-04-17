import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeDelete,
  belongsTo,
  column,
  hasMany,
  hasOne,
  manyToMany,
} from '@adonisjs/lucid/orm'

import BigNumber from 'bignumber.js'
import type { ImageType } from '#helpers/types'
import BusinessProfile from './businessProfile.js'
import ServiceCategory from './serviceCategory.js'
import ServiceSubcategory from './serviceSubcategory.js'
import Image from './image.js'
import Seo from './seo.js'
import Faq from './faq.js'
import ServiceTag from './serviceTag.js'
import Review from './review.js'
import ServiceVariant from './serviceVariant.js'
import Coupon from './coupon.js'
import type { BelongsTo, HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Service extends BaseModel {
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare shortDesc: string

  @column()
  declare longDesc: string

  @column()
  declare isActive: boolean

  @column()
  declare locationSpecific: boolean

  @column()
  declare geoLocation: string

  @column({
    serialize: (v) => new BigNumber(v || 0).toFixed(1),
  })
  declare avgRating: string | number

  @column()
  declare video: ImageType

  @column()
  declare businessProfileId: number

  @column()
  declare serviceCategoryId: number

  @column()
  declare serviceSubcategoryId: number

  @belongsTo(() => BusinessProfile)
  declare businessProfile: BelongsTo<typeof BusinessProfile>

  @belongsTo(() => ServiceCategory)
  declare serviceCategory: BelongsTo<typeof ServiceCategory>

  @belongsTo(() => ServiceSubcategory)
  declare serviceSubcategory: BelongsTo<typeof ServiceSubcategory>

  @hasMany(() => Image)
  declare images: HasMany<typeof Image>

  @hasOne(() => Seo)
  declare seo: HasOne<typeof Seo>

  @hasMany(() => Faq)
  declare faq: HasMany<typeof Faq>

  @manyToMany(() => ServiceTag, {
    pivotTable: 'service_tags_pivot',
  })
  declare tags: ManyToMany<typeof ServiceTag>

  @hasMany(() => Review)
  declare reviews: HasMany<typeof Review>

  @hasMany(() => ServiceVariant)
  declare variants: HasMany<typeof ServiceVariant>

  @manyToMany(() => Coupon, { pivotTable: 'service_coupons' })
  declare coupons: ManyToMany<typeof Coupon>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeDelete()
  static async deleteRelations(service: Service) {
    await service.load('images')
    await service.load('variants')

    if (service.images) {
      await Promise.all(
        service.images.map(async (img) => {
          await img.delete()
        })
      )
    }

    if (service.variants) {
      for (const v of service.variants) {
        await v.delete()
      }
    }
  }
}
