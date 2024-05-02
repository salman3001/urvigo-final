import type User from '#models/user'
import type { PageObject } from '@adonisjs/inertia/types'
import type ServiceVariant from '../models/service_variant.js'
import { PaymentMode, PaymentStatus, WeekDays } from './enums.js'

export type ImageType = {
  url: string
  thumbnailUrl: string
}

export type VideoType = {
  url: string
}

export type IPaginatedModel<T> = {
  meta: {
    currentPage: number
    firstPage: number
    firstPageUrl: string
    lastPage: number
    lastPageUrl: string
    nextPageUrl: string
    perPage: number
    previousPageUrl: boolean
    total: number
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
  paymentMode: PaymentMode
  paymentStatus: PaymentStatus
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

export interface IvariantFrom {
  name: string
  price: number
  discountType: 'flat' | 'percentage'
  discountFlat: number
  discountPercentage: number
  desc: string
}

export type ItimeslotPlanOptions = Array<{
  week: WeekDays
  from: string
  to: string
}>
