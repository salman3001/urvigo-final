import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.string('short_desc', 1024)
      table.text('long_desc')
      table.boolean('is_active').defaultTo(false).notNullable()
      table.boolean('location_specific').defaultTo(true).notNullable()
      table.point('geo_location')
      table.decimal('avg_rating', 2, 1).defaultTo(0)
      table.json('video')
      table.json('thumbnail')
      table
        .integer('business_profile_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('business_profiles')
        .onDelete('CASCADE')

      table
        .integer('service_category_id')
        .unsigned()
        .references('id')
        .inTable('service_categories')
        .onDelete('SET NULL')
      table
        .integer('service_subcategory_id')
        .unsigned()
        .references('id')
        .inTable('service_subcategories')
        .onDelete('SET NULL')

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
