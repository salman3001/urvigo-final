import { BaseModelFilter } from 'adonis-lucid-filter'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Coupon from '#models/coupon'

export default class CouponFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof Coupon>

  search(value: string): void {
    const searchValue = `%${value}%`
    this.$query.whereILike('name', searchValue)
  }

  orderBy(value: string): void {
    const [orderBy, direction] = value.split(':')
    this.$query.orderBy(orderBy, (direction as 'desc') || 'asc')
  }
}
