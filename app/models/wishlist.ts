import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import ServiceVariant from './service_variant.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Wishlist extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @manyToMany(() => ServiceVariant, {
    pivotTable: 'wishlist_items',
  })
  declare items: ManyToMany<typeof ServiceVariant>
}
