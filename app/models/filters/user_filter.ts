import { BaseModelFilter } from 'adonis-lucid-filter'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import User from '#models/user'

export default class UserFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof User>

  search(value: string): void {
    const searchValue = `%${value}%`
    this.$query.whereILike('first_name', searchValue).orWhereILike('last_name', searchValue)
  }

  orderBy(value: string): void {
    const [orderBy, direction] = value.split(':')
    this.$query.orderBy(orderBy, (direction as 'desc') || 'asc')
  }
}
