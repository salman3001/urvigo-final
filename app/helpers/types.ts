import User from '#models/user'
import type { PageProps } from '@adonisjs/inertia/types'

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
} & T
