export default {
  home: '/',
  faqs: '/faqs',
  chats: '/chats',
  pricing: '/pricing',
  about: '/about',
  contact: '/contact',
  help_center: { list: '/help-center' },
  blogs: {
    list: '/blogs',
    view: (slug: string) => `/blogs/blog-${slug}`,
  },
  account: {
    profile: '/account/profile',
    security: '/account/security',
    settings: '/account/settings',
    wishlist: '/account/wishlist',
    notifications: '/account/notifications',
  },
  bookings: {
    list: '/bookings',
    view: (id: number) => `/bookings/booking-${id}`,
    book_now: (variantId: number) => `/bookings/book-now-${variantId}`,
  },
  custom_bookings: {
    list: '/custom-bookings',
    view: (id: number) => `/custom-bookings/custom-booking-${id}`,
    book_now: (requirementId: number) => `/custom-bookings/book-now-${requirementId}`,
  },
  vendor_profile: {
    view: (id: number) => `/vendor-profiles/vendor-profile-${id}`,
  },
  services: {
    list: '/services',
    view: (slug: string) => `/services/service-${slug}`,
    services_by_category: (slug: string) => `/service-category/${slug}`,
  },
  service_requirement: {
    list: '/service-requirements',
    view: (id: number) => `/service-requirements/service-requirement-${id}`,
  },
}
