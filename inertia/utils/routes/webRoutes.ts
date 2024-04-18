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
    view: (id: number) => `/bookings/${id}`,
    book_now: () => `/bookings/checkout/summary`,
  },
  custom_bookings: {
    list: '/custom-bookings',
    view: (id: number) => `/custom-bookings/${id}`,
    book_now: (requirementId: number) => `/custom-bookings/checkout/${requirementId}`,
  },
  vendor_profile: {
    view: (id: number) => `/vendor-profiles/${id}`,
    reviews: {
      list: (id: number) => `/service/${id}/reviews`,
      create: (id: number) => `/service/${id}/reviews`,
    },
  },
  services: {
    list: '/services',
    view: (slug: string) => `/services/${slug}`,
    services_by_category: (slug: string) => `/service-category/${slug}`,
    reviews: {
      list: (serviceId: number) => `/services/${serviceId}/reviews`,
      create: (serviceId: number) => `/services/${serviceId}/create-review`,
    },
  },
  service_requirement: {
    list: '/service-requirements',
    create: '/service-requirements',
    view: (id: number) => `/service-requirements/${id}`,
    update: (id: number) => `/service-requirements/${id}`,
    edit: (id: number) => `/service-requirements/${id}/edit`,
    delete: (id: number) => `/service-requirements/${id}/delete`,
  },
}
