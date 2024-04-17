import { IResType } from '#helpers/types'
import { Response } from '@adonisjs/core/http'
import string from '@adonisjs/core/helpers/string'
import { CamelCaseNamingStrategy, BaseModel } from '@adonisjs/lucid/orm'

Response.macro('custom', function (this: Response, opt: IResType<any>) {
  const errorObject = opt.error ? { error: opt.error } : {}
  this.status(opt.code).send({
    message: opt.message,
    data: opt.data,
    success: opt.success,
    ...errorObject,
  })
  return this
})

declare module '@adonisjs/core/http' {
  interface Response {
    custom(opt: IResType<any>): Response
  }
}

export class MyCustomNamingStrategy extends CamelCaseNamingStrategy {
  serializedName(_model: typeof BaseModel, propertyName: string) {
    return string.camelCase(propertyName)
  }
}
