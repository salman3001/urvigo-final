import { BaseModel, belongsTo, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { ImageType } from '#helpers/types'
import User from './user.js'
import type { BelongsTo, HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import Social from './social.js'
import Address from './address.js'
import Language from './language.js'
import Skill from './skill.js'

export default class UserProfile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare avatar: ImageType

  @column()
  declare userId: number

  @column({
    prepare: (v: any) => JSON.stringify(v),
  })
  declare notificationSetting: Object

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasOne(() => Social)
  declare social: HasOne<typeof Social>

  @hasMany(() => Address)
  declare addresses: HasMany<typeof Address>

  @manyToMany(() => Language, {
    pivotColumns: ['proficiency'],
    pivotTable: 'user_languages',
  })
  declare languages: ManyToMany<typeof Language>

  @manyToMany(() => Skill, {
    pivotTable: 'user_skills',
  })
  declare skills: ManyToMany<typeof Skill>
}
