import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('address')
      table.point('geo_location')
      table
        .integer('user_profile_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('user_profiles')
        .onDelete('CASCADE')

      table
        .integer('business_profile_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('business_profiles')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
