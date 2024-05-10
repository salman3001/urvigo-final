import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

import config from '@adonisjs/core/services/config'
import { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import app from '@adonisjs/core/services/app'
import { CordType } from './types.js'
import { DateTime } from 'luxon'

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
  return str
    .replace(/[^\w\s-]/g, '') // Remove special characters except for spaces and dashes
    .trim() // Trim leading and trailing spaces
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .toLowerCase() // Convert to lowercase
}

export const isEmptyObject = (obj: Object) => {
  return Object.keys(obj).length === 0
}

export function getNamedRoutes() {
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

  if (isEmptyObject(data)) {
    console.log('routes not available')
    return
  }

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

export const isWithinRadius = (cord1: CordType, cord2: CordType, maxRadius: number) => {
  const toRadiance = (degree: number): number => degree * (Math.PI / 180)
  const { x: lon1, y: lat1 } = cord1
  const { x: lon2, y: lat2 } = cord2

  const lat1Rad = toRadiance(lat1)
  const lon1Rad = toRadiance(lon1)
  const lat2Rad = toRadiance(lat2)
  const lon2Rad = toRadiance(lon2)

  const earthRadiusKm = 6371

  const dLat = lat2Rad - lat1Rad
  const dLon = lon2Rad - lon1Rad

  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sign(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distanceKm = earthRadiusKm * c
  return distanceKm <= maxRadius
}

export function createDateTime(date: DateTime<true> | DateTime<false>, time: string) {
  const [hours, minutes] = time.split(':') // Extract hours and minutes from the time
  return date.set({
    hour: Number.parseInt(hours),
    minute: Number.parseInt(minutes),
  })
}
