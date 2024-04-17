import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'


export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare isActive: boolean

  @hasMany(() => User)
  declare AdminUser: HasMany<typeof User>

  @column({
    prepare: (v: any) => JSON.stringify(v),
  })
  declare permissions: string[]
}
