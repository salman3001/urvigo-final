import { HttpContext } from '@adonisjs/core/http'

import config from '@adonisjs/core/services/config'
import { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export async function paginate<T extends LucidModel>(
  query: ModelQueryBuilderContract<T>,
  request: HttpContext['request']
) {
  return await query.paginate(
    request.qs()?.page || 1,
    request.qs()?.perPage || config.get('common.rowsPerPage')
  )
}

export function slugify(str: string): string {
  // Remove special characters, convert spaces to dashes, and make lowercase
  return str
    .replace(/[^\w\s-]/g, '') // Remove special characters except for spaces and dashes
    .trim() // Trim leading and trailing spaces
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .toLowerCase() // Convert to lowercase
}
