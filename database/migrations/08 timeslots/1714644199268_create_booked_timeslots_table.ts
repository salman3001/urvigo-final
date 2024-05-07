import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'booked_timeslots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.dateTime('start_time').notNullable()
      table.dateTime('end_time').notNullable()
      table
        .integer('timeslot_plan_id')
        .unsigned()
        .references('id')
        .inTable('timeslot_plans')
        .onDelete('SET_NULL')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
