import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('map_address')
      table.string('address')
      table.point('geo_location')
      table
        .integer('user_profile_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('user_profiles')
        .onDelete('CASCADE')

      table
        .integer('service_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')

      table
        .integer('service_requirement_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('service_requirements')
        .onDelete('CASCADE')

      table
        .integer('booking_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('bookings')
        .onDelete('CASCADE')

      table
        .integer('bid_booking_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('bid_bookings')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
