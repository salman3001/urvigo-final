import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'conversations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')
      table
        .integer('participant_one_id')
        .unsigned()
        .references('id')
        .inTable('conversation_participants')
        .onDelete('cascade')
      table
        .integer('participant_two_id')
        .unsigned()
        .references('id')
        .inTable('conversation_participants')
        .onDelete('cascade')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
