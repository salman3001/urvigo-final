import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.json('avatar')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.json('notification_settings')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
