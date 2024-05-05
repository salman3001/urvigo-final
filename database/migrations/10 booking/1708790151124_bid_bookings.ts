import { DeliveryType, OrderStatus } from '#helpers/enums'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bid_bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('qty', 4)
      table.decimal('price', 10, 2)
      table.integer('user_id', 10).unsigned().references('id').inTable('users').onDelete('SET NULL')
      table
        .integer('business_profile_id', 10)
        .unsigned()
        .references('id')
        .inTable('business_profiles')
        .onDelete('SET NULL')
      table.json('history').defaultTo([])
      table.json('booking_detail')
      table.json('payment_detail')
      table.json('address_detail')
      table
        .enum('delivery_type', Object.values(DeliveryType))
        .notNullable()
        .defaultTo(DeliveryType.WALK_IN)
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
