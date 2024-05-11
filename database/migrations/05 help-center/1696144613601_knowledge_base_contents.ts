import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'knowledge_base_contents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').unique().notNullable()
      table.string('slug').unique().notNullable()
      table.integer('order').defaultTo(1).notNullable()
      table.boolean('is_active').defaultTo(true)
      table.boolean('featured').defaultTo(true)
      table.json('img_icon')
      table
        .integer('knowledge_base_category_id')
        .unsigned()
        .references('id')
        .inTable('knowledge_base_categories')
        .onDelete('SET NULL')

      table.integer('language_id').unsigned().references('id').inTable('languages')
      table.string('short_desc', 512)
      table.text('content')
      table.string('meta_title')
      table.string('meta_desc', 256)
      table.string('meta_keywords')

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
