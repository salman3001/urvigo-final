import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.decimal('rating', 2, 1).notNullable()
      table.string('message', 1500).notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')

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
