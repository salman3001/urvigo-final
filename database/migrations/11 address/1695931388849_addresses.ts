import { AddressType } from '#helpers/enums'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.enum('type', Object.values(AddressType)).defaultTo(AddressType.HOME).notNullable()
      table.string('map_address')
      table.string('address')
      table.string('mobile')
      table.point('geo_location')
      table
        .integer('user_profile_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('user_profiles')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
