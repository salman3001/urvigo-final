import { BaseModelFilter } from 'adonis-lucid-filter'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Role from '#models/role'

export default class RoleFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof Role>

  search(value: string): void {
    const searchValue = `%${value}%`
    this.$query.whereILike('name', searchValue)
  }

  orderBy(value: string): void {
    const [orderBy, direction] = value.split(':')
    this.$query.orderBy(orderBy, (direction as 'desc') || 'asc')
  }

  isActive(value: boolean): void {
    this.$query.where('is_active', value)
  }
}
