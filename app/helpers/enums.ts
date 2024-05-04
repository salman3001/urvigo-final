export enum TicketStatus {
  OPEN = 1,
  CLOSED = 2,
  RESPONDED = 3,
}

export enum ServiceLocationType {
  SPECIFIC = 'Specific',
  PHYSICAL = 'Physical',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum permissions {
  MANAGE_ADMIN_USERS = '1',
  MANAGE_BLOGS = '2',
  MANAGE_CAMPAIGNS = '3',
  MANAGE_SUBSCRIBERS = '4',
  MANAGE_INTERESTS = '5',
  MANAGE_TEMPLATES = '6',
  MANAGE_CONTACT_MESSAGES = '7',
  MANAGE_KNOWLEDGEBASE = '8',
  MANAGE_TICKETS = '9',
  MANAGE_PRODUCT = '10',
  MANAGE_SERVICE = '11',
  MANAGE_USER = '12',
  MANAGE_LOCATION = '13',
  MANAGE_ROLES = '14',
  MANAGE_MEDIA = '15',
  MANAGE_BUSINESS = '16',
  MANAGE_BOOKINGS = '17',
  MANAGE_BID_BOOKINGS = '18',
  MANAGE_COUPONS = '19',
}

export enum NotificationTypes {
  NEW_SUPPORT_TICKET = '1',
  BOOKING_CREATED = '2',
  BOOKING_RECIEVED = '3',
  SERVICE_REQUIREMENT_ADDED = '4',
  BID_RECIEVED = '5',
}

export enum MediaTypes {
  VIDEO = 'Video',
  IMAGE = 'Image',
}

export enum OrderStatus {
  PLACED = '1',
  CONFIRMED = '2',
  COMPLETION_REQUESTED = '3',
  COMPLETED = '4',
  CANCLED = '5',
  REJECTED = '6',
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum userTypes {
  USER = '1',
  ADMIN = '2',
  VENDER = '3',
}

export enum CouponType {
  VENDOR = '1',
  ADMIN = '2',
}

export enum DiscountType {
  FLAT = '1',
  PERCENATAGE = '2',
}

export enum BudgetType {
  HOURLY = 'hourly',
  FIXED = 'fixed',
}

export enum PaymentStatus {
  PENDING = '1',
  PARTIAL_PAIID = '2',
  PAID = '3',
  REFUND_REQUESTED = '4',
  REFUNDED = '5',
}

export enum PaymentMode {
  COD = '1',
  ONLINE = '2',
}

export enum DeliveryOptions {
  HOME_SERVICE = '1',
  WALK_IN = '2',
  BOTH = '3',
}

export enum WeekDays {
  MONDAY = '1',
  TUESDAY = '2',
  WEDNESDAY = '3',
  THURSDAY = '4',
  FRIDAY = '5',
  SATURDAY = '6',
  SUNDAY = '7',
}

export enum AddressType {
  HOME = '1',
  OFFICE = '2',
}
