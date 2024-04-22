import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

import config from '@adonisjs/core/services/config'
import { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import app from '@adonisjs/core/services/app'

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

export function getNamedRoutes() {
  /**
   * Only sharing the main domain routes. Subdomains are
   * ignored for now. Let's see if many people need it
   */

  const mainDomainRoutes = router.toJSON()?.['root'] ?? []

  return mainDomainRoutes.reduce<Record<string, string>>((routes, route) => {
    if (route.name) {
      routes[route.name] = route.pattern
    } else if (typeof route.handler === 'string') {
      routes[route.handler] = route.pattern
    }

    return routes
  }, {})
}

export function exportNamedRoutes() {
  const data = getNamedRoutes()
  const outputDir = app.makePath(app.appRoot + '/inertia/utils') // Directory where the TS file will be written
  const outputFileName = 'routes' // File name without the extension
  console.log(outputDir)

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  const tsContent = `const routesObject = ${JSON.stringify(data, null, 2)};

export default function routes(
  routeName: keyof typeof routesObject,
  params: Array<string | number> = []
) {
  const route = routesObject[routeName]
  if (!route) {
    throw new Error(\`Route name "\${routeName}" not found in the map.\`)
  }
  if (params.length === 0 || !/:/.test(route)) {
    return route
  }
  const parts = route.split('/')
  let paramIndex = 0
  const result = parts.map((part) => {
    if (part.startsWith(':') && paramIndex < params.length) {
      return params[paramIndex++]
    } else {
      return part
    }
  })
  return result.join('/')
}
`
  const filePath = path.join(outputDir, `${outputFileName}.ts`)

  writeFileSync(filePath, tsContent)
  console.log('routes exported')
}
