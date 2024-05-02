import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    errors: (ctx) => ctx.session?.flashMessages.get('errors'),
    flash: (ctx) => ctx.session?.flashMessages.get('flash'),
    user: async (ctx) => {
      await ctx.auth.use('web').user?.load('profile')
      return ctx.auth.use('web').user
    },
    query: (ctx) => ctx.request.qs(),
    params: (ctx) => ctx.request.params(),
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.ts',
    pages: (_ctx, page) =>
      !page.startsWith('vendor') &&
      !page.startsWith('admin') &&
      !page.startsWith('account') &&
      !page.startsWith('bookings') &&
      !page.startsWith('service-requirements') &&
      !page.startsWith('vendor-profile') &&
      !page.startsWith('chat') &&
      !page.startsWith('custom-bookings'),
  },
})
