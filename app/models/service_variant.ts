import { DiscountType } from '#helpers/enums'
import type { ImageType } from '#helpers/types'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Service from './service.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ServiceVariant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare price: string | number

  @column()
  declare discountType: DiscountType

  @column()
  declare discountFlat: string | number

  @column()
  declare discountPercentage: string | number

  @column()
  declare desc: string

  @column()
  declare order: number

  @column()
  declare image: ImageType

  @column()
  declare serviceId: number

  @belongsTo(() => Service)
  declare service: BelongsTo<typeof Service>

  @column({
    prepare: (v) => JSON.stringify(v),
  })
  declare additionalProperties: Object
}
