import { DeliveryOptions, OrderStatus } from '#helpers/enums'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('qty', 4)
      table
        .integer('service_variant_id', 10)
        .unsigned()
        .references('id')
        .inTable('service_variants')
        .onDelete('SET NULL')
      table.integer('user_id', 10).unsigned().references('id').inTable('users').onDelete('SET NULL')
      table
        .integer('business_profile_id', 10)
        .unsigned()
        .references('id')
        .inTable('business_profiles')
        .onDelete('SET NULL')
      table
        .integer('booked_timeslot_id', 10)
        .unsigned()
        .references('id')
        .inTable('booked_timeslots')
        .onDelete('SET NULL')
      table.json('booking_detail')
      table.json('payment_detail')
      table.json('address_detail')
      table
        .enum('delivery_type', Object.values(DeliveryOptions))
        .notNullable()
        .defaultTo(DeliveryOptions.WALK_IN)
      table.json('history').defaultTo([])
      table.enum('status', Object.values(OrderStatus)).notNullable().defaultTo(OrderStatus.PLACED)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.raw('DROP TYPE IF EXISTS "status"')
    this.schema.dropTable(this.tableName)
  }
}
