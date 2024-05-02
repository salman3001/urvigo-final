import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { Filterable } from 'adonis-lucid-filter'
import RoleFilter from './filters/role_filter.js'

export default class Role extends compose(BaseModel, Filterable) {
  static $filer = () => RoleFilter
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare isActive: boolean

  @hasMany(() => User)
  declare user: HasMany<typeof User>

  @column({
    prepare: (v: any) => JSON.stringify(v),
  })
  declare permissions: number[]
}
