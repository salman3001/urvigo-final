import { BaseModelFilter } from 'adonis-lucid-filter'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Blog from '#models/blog'

export default class BlogFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof Blog>

  search(value: string): void {
    const searchValue = `%${value}%`
    this.$query.whereILike('title', searchValue)
  }

  orderBy(value: string): void {
    const [orderBy, direction] = value.split(':')
    this.$query.orderBy(orderBy, (direction as 'desc') || 'asc')
  }

  isPublished(value: boolean): void {
    this.$query.where('is_published', value)
  }

  category(id: number): void {
    this.$query.where('blog_category_id', id)
  }
}
