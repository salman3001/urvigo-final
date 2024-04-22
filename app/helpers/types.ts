import User from '#models/user'
import { PageObject } from '@adonisjs/inertia/types'
import ServiceVariant from '../models/service_variant.js'

export type ImageType = {
  url: string
  thumbnailUrl: string
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
  data: T[]
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

export type Prop<T extends (...args: any[]) => Promise<string | PageObject>> = Exclude<
  Awaited<ReturnType<T>>,
  string
>['props']

export interface PaymentDetail {
  paymentMode: 'cod' | 'online'
  paymentStatus: 'pending' | 'paid'
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IBookingDetail {
  couponId?: number
  vendorUserId: number
  service_variant: ServiceVariant
  qty: number
  totalWithoutDiscount: string
  vendorDiscount: string
  totalAfterDiscount: string
  couponDiscount: string
  grandTotal: string
}

export interface IbidBookingDetail {
  serviceRequirement: {
    id: number
    title: string
    desc: string
    budgetUnit: string
    budget: string | number
  }
  acceptedBid: {
    id: number
    offeredPrice: string | number
  }
}

export interface IndexOption {
  disableFilter?: boolean
}
