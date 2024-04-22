import { BaseModelFilter } from 'adonis-lucid-filter'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Service from '#models/service'

export default class ServiceFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof Service>

  search(value: string): void {
    const searchValue = `%${value}%`
    this.$query.whereILike('name', searchValue)
  }

  orderBy(value: string): void {
    const [orderBy, direction] = value.split(':')
    this.$query.orderBy(orderBy, (direction as 'desc') || 'asc')
  }

  serviceCategory(id: string): void {
    this.$query.where('service_category_id', id)
  }
}
