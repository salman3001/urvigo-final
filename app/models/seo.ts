import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Seo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare metaTitle: string

  @column()
  declare metaKeywords: string

  @column()
  declare metaDesc: string

  @column()
  declare serviceSubcategoryId: number

  @column()
  declare serviceCategoryId: number

  @column()
  declare serviceTagId: number

  @column()
  declare serviceId: number

  @column()
  declare vendorProfileId: number
}

export type ISeo = Seo