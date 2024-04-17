import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'languages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 50).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
