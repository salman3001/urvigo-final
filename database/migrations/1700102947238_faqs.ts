import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'faqs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('quest')
      table.string('ans', 1000)
      table.integer('order').defaultTo(1).notNullable()
      table
        .integer('service_subcategory_id')
        .unsigned()
        .references('id')
        .inTable('service_subcategories')
        .onDelete('CASCADE')
      table
        .integer('service_category_id')
        .unsigned()
        .references('id')
        .inTable('service_categories')
        .onDelete('CASCADE')
      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
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
