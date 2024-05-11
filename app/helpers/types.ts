import type User from '#models/user'
import type { PageObject } from '@adonisjs/inertia/types'
import type ServiceVariant from '../models/service_variant.js'
import type {
  DeliveryOptions,
  DiscountType,
  NotificationTypes,
  PaymentMode,
  PaymentStatus,
  WeekDays,
} from './enums.js'

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
  errors?: Array<{
    message: string
    field: string
    rule: string
  }>
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

export interface BookingSummary {
  businessProfileId: number
  bookingDetail: {
    couponId: number | undefined
    vendorUserId: number
    service_variant: ServiceVariant
    qty: number
    totalWithoutDiscount: string
    vendorDiscount: string
    totalAfterDiscount: string
    couponDiscount: string
    grandTotal: string
  }
  paymentDetail: {
    paymentMode: null
    paymenAddress: null
  }
  addressDetail: {
    address: string
    mapAddress: string
    mobile: string
    geoLocation: string
  }
  deliveryType: DeliveryOptions
  timeslot?: {
    timeslotPlanId: number
    from: string | Date
    to: string | Date
  }
}

export interface IbookingAddressDetail {
  geoLocation: string
  mapAddress: string
  address?: string
  mobile: string
}

export interface IndexOption {
  disableFilter?: boolean
  unPaginated?: boolean
}

export interface IvariantFrom {
  name: string
  price: number
  discountType: DiscountType
  discountFlat: number
  discountPercentage: number
  desc: string
}

export type ItimeslotPlanOptions = Array<{
  week: WeekDays
  from: string
  to: string
}>

export interface CordType {
  x: number
  y: number
}

export type SlotType = Array<{
  from: string
  to: string
}>

export type ReviewsCountInfo = Array<{
  rating: 1 | 2 | 3 | 4 | 5
  value: number | string
}>

export type ServiceReviewsInfo = {
  avgRating: number | string
  totalReviews: number | string
  counts: ReviewsCountInfo
}

export type VendorReviewsInfo = {
  avgResponseTime: number | string
  avgQualityOfService: number | string
  avgProfessionalBehavior: number | string
  avgCommunication: number | string
  avgFairPricing: number | string
  avgRating: number | string
  totalReviews: number | string
  counts: ReviewsCountInfo
}

export interface BookingCreatedNotification {
  type: NotificationTypes.BOOKING_CREATED
  title: string
  subTitle: string
  meta: {
    booking_id: number
  }
}

export interface CustomBookingCreatedNotification {
  type: NotificationTypes.CUSTOM_BOOKING_CREATED
  title: string
  subTitle: string
  meta: {
    booking_id: number
  }
}

export interface BookingRecievedNotification {
  type: NotificationTypes.BOOKING_RECIEVED
  title: string
  subTitle: string
  meta: {
    booking_id: number
  }
}

export interface CustomBookingRecievedNotification {
  type: NotificationTypes.CUSTOM_BOOKING_RECIEVED
  title: string
  subTitle: string
  meta: {
    booking_id: number
  }
}

export interface BidRecievedNotification {
  type: NotificationTypes.BID_RECIEVED
  title: string
  subTitle: string
  meta: {
    requirement_id: number
  }
}

export interface NegotiationRequiestedNotification {
  type: NotificationTypes.NEGOTIATION_REQUESTED
  title: string
  subTitle: string
  meta: {
    requirement_id: number
  }
}

export interface NegotiatedNotification {
  type: NotificationTypes.NEGOTIATED
  title: string
  subTitle: string
  meta: {
    requirement_id: number
  }
}

export interface ServiceRequirementAddedNotification {
  type: NotificationTypes.SERVICE_REQUIREMENT_ADDED
  title: string
  subTitle: string
  meta: {
    requirement_id: number
  }
}

export type NotificationData =
  | BookingCreatedNotification
  | BookingRecievedNotification
  | CustomBookingCreatedNotification
  | CustomBookingRecievedNotification
  | BidRecievedNotification
  | NegotiationRequiestedNotification
  | NegotiatedNotification
  | ServiceRequirementAddedNotification
