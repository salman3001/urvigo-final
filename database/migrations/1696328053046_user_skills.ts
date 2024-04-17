import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_skills'

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
        .integer('skill_id', 10)
        .unsigned()
        .references('id')
        .inTable('skills')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
