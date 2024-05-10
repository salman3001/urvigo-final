import { DeliveryOptions, DiscountType, PaymentMode, PaymentStatus } from '#helpers/enums'
import { DateTime } from 'luxon'

export const timeslotPayload = {
  name: 'plan 1',
  limitToOneBooking: false,
  skipHours: 26,
  options: [
    {
      week: DateTime.local().plus({ day: 1, hour: 1 }).weekday.toString(),
      from: DateTime.local().plus({ day: 1, hour: 1 }).toLocaleString(DateTime.TIME_24_SIMPLE),
      to: DateTime.local().plus({ day: 1, hour: 2 }).toLocaleString(DateTime.TIME_24_SIMPLE),
    },
    {
      week: DateTime.local().plus({ day: 1, hour: 1 }).weekday.toString(),
      from: DateTime.local().plus({ day: 1, hour: 3 }).toLocaleString(DateTime.TIME_24_SIMPLE),
      to: DateTime.local().plus({ day: 1, hour: 4 }).toLocaleString(DateTime.TIME_24_SIMPLE),
    },
    {
      week: DateTime.local().plus({ day: 1, hour: 1 }).weekday.toString(),
      from: DateTime.local().plus({ day: 1, hour: 4 }).toLocaleString(DateTime.TIME_24_SIMPLE),
      to: DateTime.local().plus({ day: 1, hour: 5 }).toLocaleString(DateTime.TIME_24_SIMPLE),
    },
    {
      week: DateTime.local().plus({ day: 1, hour: 1 }).weekday.toString(),
      from: DateTime.local().plus({ day: 1, hour: 5 }).toLocaleString(DateTime.TIME_24_SIMPLE),
      to: DateTime.local().plus({ day: 1, hour: 6 }).toLocaleString(DateTime.TIME_24_SIMPLE),
    },
  ],
}

export const servicePayload = {
  service: {
    name: 'service 1',
    shortDesc: '',
    longDesc: '',
    isActive: true,
    deliveryOptions: [DeliveryOptions.HOME_SERVICE, DeliveryOptions.WALK_IN],
    geoLocation: '28.61,77.20',
    address: 'jskjs kj s',
    kmRadius: 10,
    serviceCategoryId: '',
    serviceSubcategoryId: '',
  },
  timeSlotPlanId: '',
  seo: {
    metaTitle: 'dada',
    metaKeywords: 'asdas',
    metaDesc: 'dasd',
  },
  faq: [
    {
      quest: 'Faq 1',
      ans: 'Ans 1',
    },
  ],
  tags: [],
  variant: [
    {
      name: 'varinat 1',
      price: '200',
      discountType: DiscountType.FLAT,
      discountFlat: 10,
      discountPercentage: 15,
      desc: '',
    },
  ],
}

export const createBookingPayload = {
  serviceVariantId: 1,
  qty: 2,
  couponId: '',
  paymentDetail: {
    paymentMode: PaymentMode.ONLINE,
    paymentStatus: PaymentStatus.PAID,
  },
  addressDetail: {
    geoLocation: '28.61,77.20',
    mapAddress: 'd gdfg df gd',
    address: ' gd gdf',
    mobile: '981525445788',
  },
  deliveryType: DeliveryOptions.HOME_SERVICE,
  timeslot: {
    timeslotPlanId: 1,
    from: DateTime.local().plus({ day: 1, hour: 3 }).toFormat('dd/LL/yyyy HH:mm'),
    to: DateTime.local().plus({ day: 1, hour: 4 }).toFormat('dd/LL/yyyy HH:mm'),
  },
}

export const createServiceReviewPayload = {
  rating: 4.0,
  message: 'klsdj flksj fkljsd kflskdfksfkjskjf sk',
}

export const createReviewReviewPayload = {
  responseTime: 4,
  qualityOfService: 3,
  professionalBehavior: 5,
  communication: 3,
  fairPricing: 2,
  message: 'sasa sjah s',
}
