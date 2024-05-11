import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'knowledge_base_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('language_id')
        .unsigned()
        .references('id')
        .inTable('languages')
        .onDelete('SET NULL')
      table.string('name').unique().notNullable()
      table.string('slug').unique().notNullable()
      table.integer('order').unsigned().unique()
      table.json('img_icon')
      table.string('meta_title')
      table.string('meta_desc', 512)
      table.string('meta_keywords')

      table.index(['slug'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
