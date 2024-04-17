import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'socials'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('website')
      table.string('facebook')
      table.string('twitter')
      table.string('instagram')
      table.string('pintrest')
      table.string('linkedin')
      table.string('vk')
      table.string('whatsapp')
      table.string('telegram')
      table
        .integer('user_profile_id')
        .unsigned()
        .references('id')
        .inTable('user_profiles')
        .onDelete('CASCADE')
      table
        .integer('business_profile_id')
        .unsigned()
        .references('id')
        .inTable('business_profiles')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
