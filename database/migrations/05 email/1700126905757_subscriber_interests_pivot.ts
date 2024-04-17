import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscriber_interests_pivot'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('subscriber_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('subscribers')
        .onDelete('CASCADE')
      table
        .integer('interest_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('interests')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
