import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'seos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('meta_title')
      table.string('meta_keywords')
      table.string('meta_desc')
      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')
      table
        .integer('service_category_id')
        .unsigned()
        .references('id')
        .inTable('service_categories')
        .onDelete('CASCADE')
      table
        .integer('service_subcategory_id')
        .unsigned()
        .references('id')
        .inTable('service_subcategories')
        .onDelete('CASCADE')

      table
        .integer('service_tag_id')
        .unsigned()
        .references('id')
        .inTable('service_tags')
        .onDelete('CASCADE')

      table
        .integer('business_profile_id')
        .unsigned()
        .references('id')
        .inTable('business_profiles')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
