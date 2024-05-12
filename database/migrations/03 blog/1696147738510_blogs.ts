import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'blogs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').unique().notNullable()
      table.string('slug').unique().notNullable()
      table.boolean('is_published').defaultTo(0)
      table.json('thumbnail')
      table.string('short_desc', 512)
      table
        .integer('language_id')
        .unsigned()
        .references('id')
        .inTable('languages')
        .onDelete('SET NULL')
      table
        .integer('blog_category_id')
        .unsigned()
        .references('id')
        .inTable('blog_categories')
        .onDelete('SET NULL')
      table.text('long_desc')
      table.string('meta_title')
      table.string('meta_keywords')
      table.string('meta_desc')

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
