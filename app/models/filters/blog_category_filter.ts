import { BaseModelFilter } from 'adonis-lucid-filter'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import BlogCategory from '#models/blog_category'

export default class BlogCategoryFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof BlogCategory>

  search(value: string): void {
    const searchValue = `%${value}%`
    this.$query.whereILike('name', searchValue)
  }

  orderBy(value: string): void {
    const [orderBy, direction] = value.split(':')
    this.$query.orderBy(orderBy, (direction as 'desc') || 'asc')
  }
}
