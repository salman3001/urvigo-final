import { BaseModelFilter } from 'adonis-lucid-filter'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Booking from '#models/booking'

export default class BookingFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof Booking>

  search(value: string): void {
    const searchValue = `%${value}%`
    this.$query.whereILike('id', searchValue)
  }

  orderBy(value: string): void {
    const [orderBy, direction] = value.split(':')
    this.$query.orderBy(orderBy, (direction as 'desc') || 'asc')
  }
}
