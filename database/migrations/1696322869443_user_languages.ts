import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_languages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_profile_id', 10)
        .unsigned()
        .references('id')
        .inTable('user_profiles')
        .onDelete('CASCADE')
      table
        .integer('language_id', 10)
        .unsigned()
        .references('id')
        .inTable('languages')
        .onDelete('CASCADE')
      table.boolean('proficiency').defaultTo('false')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
