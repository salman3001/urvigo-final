import { BaseModelFilter } from 'adonis-lucid-filter'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import BidBooking from '#models/bid_booking'

export default class BidBookingFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof BidBooking>

  search(value: string): void {
    const searchValue = `%${value}%`
    this.$query.whereILike('id', searchValue)
  }

  orderBy(value: string): void {
    const [orderBy, direction] = value.split(':')
    this.$query.orderBy(orderBy, (direction as 'desc') || 'asc')
  }
}
