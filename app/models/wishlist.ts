import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Service from './service.js'
import User from './user.js'

export default class Wishlist extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Service, {
    pivotTable: 'wishlist_items',
  })
  declare items: ManyToMany<typeof Service>
}

export type IWishlist = Wishlist
