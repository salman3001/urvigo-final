import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'timeslot_plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.boolean('limit_to_one_booking').notNullable().defaultTo(false)
      table.json('options').notNullable().defaultTo([])
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('service_id').unsigned().references('id').inTable('services')
      table.integer('bid_id').unsigned().references('id').inTable('bids')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
