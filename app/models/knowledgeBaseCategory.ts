import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Language from './language.js'
import KnowledgeBaseContent from './knowledgeBaseContent.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'


export default class KnowledgeBaseCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare languageId: number

  @belongsTo(() => Language)
  declare language: BelongsTo<typeof Language>

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare order: number

  @column()
  declare isActive: boolean

  @column()
  declare metaTitle: string

  @column()
  declare metaDesc: string

  @column()
  declare metaKeywords: string

  @hasMany(() => KnowledgeBaseContent)
  declare contents: HasMany<typeof KnowledgeBaseContent>
}
