import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'campaign_interests_pivot'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('campaign_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('campaigns')
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
