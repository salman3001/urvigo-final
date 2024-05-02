import { BaseModelFilter } from 'adonis-lucid-filter'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import ServiceRequirement from '#models/service_requirement'

export default class ServiceRequirementFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof ServiceRequirement>

  search(value: string): void {
    const searchValue = `%${value}%`
    this.$query.whereILike('title', searchValue)
  }

  orderBy(value: string): void {
    console.log(value)

    const [orderBy, direction] = value.split(':')
    this.$query.orderBy(orderBy, (direction as 'desc') || 'asc')
  }

  completed(value: string): void {
    if (value) {
      this.$query.whereNotNull('accepted_bid_id')
    }
  }

  active(value: string): void {
    if (value) {
      this.$query.whereNull('accepted_bid_id')
    }
  }

  expiresAtLt(value: string): void {
    if (value) {
      this.$query.where('expires_at', '<', value)
    }
  }

  expiresAtGt(value: string): void {
    if (value) {
      this.$query.where('expires_at', '>', value)
    }
  }
}
