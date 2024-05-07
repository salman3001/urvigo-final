import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'service_tags_pivot'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('service_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')
      table
        .integer('service_tag_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('service_tags')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
