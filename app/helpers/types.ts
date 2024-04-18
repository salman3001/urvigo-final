import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { PageObject, PageProps } from '@adonisjs/inertia/types'
import { LucidModel, ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export type ImageType = {
  url: string
}

export type VideoType = {
  url: string
}

export type IPaginatedModel<T> = {
  meta: {
    perPage: number
    currentPage: number
    firstPage: number
    isEmpty: boolean
    total: number
    hasTotal: boolean
    lastPage: number
    hasMorePages: boolean
    hasPages: boolean
  }
  data: T
}

export type IResType<T> = {
  code: number
  data: T
  message: string | null
  success: boolean
  error?: string
}

export type IPageProps<T> = {
  user: User | null
  query: Record<any, any>
  params: Record<any, any>
  flash?: {
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
  }
  meta: Record<any, any>
} & T

type InertiaPartialPropsType = (...args: any[]) => Record<'props', unknown> | Record<any, any>

type ObjectReturnType<T> = T extends string ? never : T
export type Prop<T extends InertiaPartialPropsType> = ObjectReturnType<
  Awaited<ReturnType<T>>
>['props']

export type AwaitedInfer<T extends InertiaPartialPropsType> = Awaited<ReturnType<T>>
