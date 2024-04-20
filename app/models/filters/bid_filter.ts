import { BaseModelFilter } from 'adonis-lucid-filter'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Bid from '#models/bid'

export default class BidFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof Bid>

  // search(value: string): void {
  //   const searchValue = `%${value}%`
  //   this.$query.whereILike('title', searchValue)
  // }
}
