import routes from '~/utils/routes'

export default [
  {
    title: 'Dashboard',
    icon: { icon: 'tabler-brand-envato' },
    children: [{ title: 'Analytics', to: routes('vendor.dashboard') }],
  },
  {
    title: 'Services',
    icon: { icon: 'tabler-brand-asana' },
    children: [
      {
        title: 'My Services',
        to: routes('vendor.service.index'),
      },
      {
        title: 'Timeslot Plans',
        to: routes('vendor.timeslot-plans.index'),
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
    ],
  },
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
  {
    title: 'My Bookings',
    icon: { icon: 'tabler-shopping-cart' },
    children: [
      {
        title: 'My Bookings',
        to: routes('vendor.booking.index'),
      },
      {
        title: 'My Custom Bookings',
        to: routes('vendor.custom-booking.index'),
      },
    ],
  },

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
]
