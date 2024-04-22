import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'wishlist_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('wishlist_id', 10)
        .unsigned()
        .references('id')
        .inTable('wishlists')
        .onDelete('CASCADE')
      table
        .integer('service_id', 10)
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
