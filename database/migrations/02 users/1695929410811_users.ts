import { BaseSchema } from '@adonisjs/lucid/schema'
import { userTypes } from '#helpers/enums'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('first_name', 50)
      table.string('last_name', 50)
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('phone', 15)
      table.enum('user_type', Object.values(userTypes)).defaultTo(userTypes.USER).notNullable()
      table.boolean('is_active').defaultTo(false).notNullable()
      table.string('socket_token').nullable()
      table.string('otp').nullable()
      table.integer('role_id').unsigned().references('roles.id').onDelete('SET NULL')
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
