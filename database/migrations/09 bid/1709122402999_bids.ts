import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bids'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.decimal('offered_price', 8, 2)
      table.string('message', 1500)
      table.json('negotiate_history').defaultTo([])
      table
        .integer('service_requirement_id')
        .unsigned()
        .references('id')
        .inTable('service_requirements')
        .onDelete('SET NULL')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
