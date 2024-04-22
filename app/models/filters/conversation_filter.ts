import { BaseModelFilter } from 'adonis-lucid-filter'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Conversation from '#models/conversation'

export default class ConversationFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof Conversation>

  search(value: string): void {
    const searchValue = `%${value}%`
    this.$query.whereILike('name', searchValue)
  }
}
