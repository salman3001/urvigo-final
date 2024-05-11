import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import KnowledgeBaseCategory from './knowledge_base_category.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Language from './language.js'
import type { ImageType } from '#helpers/types'

export default class KnowledgeBaseContent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare isActive: boolean

  @column()
  declare featured: boolean

  @column()
  declare order: number

  @column()
  declare imgIcon: ImageType

  @column()
  declare knowledgeBaseCategoryId: number

  @belongsTo(() => KnowledgeBaseCategory)
  declare category: BelongsTo<typeof KnowledgeBaseCategory>

  @column()
  declare languageId: number

  @belongsTo(() => Language)
  declare language: BelongsTo<typeof Language>

  @column()
  declare shortDesc: string

  @column()
  declare content: string

  @column()
  declare metaTitle: string
  @column()
  declare metaDesc: string
  @column()
  declare metaKeywords: string
}
