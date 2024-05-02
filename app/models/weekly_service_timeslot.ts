import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class WeeklyServiceTimeslot extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
}
