// @ts-nocheck
import stringHelpers from '@adonisjs/core/helpers/string'

export function convertKeysToCamelCase(obj: any) {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item))
  } else if (typeof obj === 'object' && obj !== null) {
    const camelCaseObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        camelCaseObj[stringHelpers.camelCase(key)] = convertKeysToCamelCase(obj[key])
      }
    }
    return camelCaseObj
  } else {
    return obj
  }
}
