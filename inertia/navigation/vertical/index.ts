import routes from '~/utils/routes'

export default [
  { heading: 'Analytics' },
  {
    title: 'Dashboard',
    icon: { icon: 'tabler-brand-envato' },
    children: [{ title: 'Analytics', to: routes('vendor.dashboard') }],
  },
  { heading: 'Services & Coupons' },
  {
    title: 'Services',
    icon: { icon: 'tabler-brand-asana' },
    children: [
      {
        title: 'My Services',
        to: routes('vendor.service.index'),
      },
      {
        title: 'Add New Service',
        to: routes('vendor.service.create'),
      },
    ],
  },
  {
    title: 'Coupns',
    icon: { icon: 'tabler-gift-card' },
    children: [
      {
        title: 'My Coupons',
        to: routes('vendor.coupon.index'),
      },
      {
        title: 'Add New Coupon',
        to: routes('vendor.coupon.create'),
      },
    ],
  },
  { heading: 'Bids & Requirements' },
  {
    title: 'Bids & Requirements ',
    icon: { icon: 'tabler-hand-grab' },
    children: [
      {
        title: 'My Bids',

        to: routes('vendor.my-bids.index'),
      },
      {
        title: 'Requirements',
        to: routes('vendor.requirements.index'),
        // action: 'read',
        // subject: 'AclDemo',
        badgeContent: 'New',
        badgeClass: 'bg-error',
      },
    ],
  },

  { heading: 'Bookings' },
  {
    title: 'My Bookings',
    icon: { icon: 'tabler-shopping-cart' },
    children: [
      {
        title: 'My Bookings',
        icon: { icon: 'tabler-shopping-cart' },
        to: routes('vendor.booking.index'),
      },
      {
        title: 'My Custom Bookings',
        icon: { icon: 'tabler-shopping-cart' },
        to: routes('vendor.custom-booking.index'),
      },
    ],
  },
  { heading: 'Payments' },

  {
    title: 'Wallet & Payments',
    icon: { icon: 'tabler-wallet' },
    children: [
      {
        title: 'Payments',
        to: routes('web.home'),
      },
      {
        title: 'Wallet',
        to: routes('web.home'),
      },
    ],
  },
  { heading: 'Settings' },
  {
    title: 'Settings Page 1',
    icon: { icon: 'tabler-shopping-cart' },
    to: routes('web.home'),
  },
  {
    title: 'Settings Page 2',
    icon: { icon: 'web.home' },
    to: routes('web.home'),
  },
]
