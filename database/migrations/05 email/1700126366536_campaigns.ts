import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'campaigns'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('subject').notNullable()
      table.string('from_name').notNullable()
      table.string('from_email').notNullable()
      table.string('reply_to').notNullable()
      table.boolean('status').defaultTo(false).notNullable()
      table.dateTime('delivery_date_time')
      table.integer('campaign_type_id').unsigned().references('id').inTable('campaign_types')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
