import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vendor_reviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.decimal('response_time', 2, 1).notNullable()
      table.decimal('quality_of_service', 2, 1).notNullable()
      table.decimal('professional_behavior', 2, 1).notNullable()
      table.decimal('communication', 2, 1).notNullable()
      table.decimal('fair_pricing', 2, 1).notNullable()
      table.decimal('avg_rating', 2, 1).notNullable()
      table.string('message', 1500).notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('business_profile_id')
        .unsigned()
        .references('id')
        .inTable('business_profiles')
        .onDelete('CASCADE')

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
