import { TimeSlotStatus, WeekDays } from '#helpers/enums'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'weekly_service_timeslots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('week_day', Object.values(WeekDays)).notNullable()
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()
      table.enum('status', Object.values(TimeSlotStatus)).notNullable()
      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
