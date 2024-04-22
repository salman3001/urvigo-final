const routesObject = {
  "web.auth.login": "/auth/login",
  "web.auth.login.post": "/auth/login",
  "web.auth.signup": "/auth/signup",
  "web.auth.signup.post": "/auth/signup",
  "web.auth.forgot-password": "/auth/forgot-password",
  "web.auth.forgot-password.post": "/auth/forgot-password",
  "web.auth.auth.reset-password": "/auth/reset-password",
  "web.auth.reset-password.post": "/auth/reset-password",
  "web.auth.logout": "/auth/logout",
  "web.home": "/",
  "web.temp": "/temp",
  "web.temp.post": "/temp-post",
  "web.services": "/services",
  "web.services.show": "/services/:slug",
  "web.services.create_review": "/services/:id/create-review",
  "web.booking.list": "/bookings",
  "web.booking.show": "/bookings/:id",
  "web.booking.summary": "/bookings/checkout/summary",
  "web.booking.address": "/bookings/checkout/address",
  "web.booking.payment": "/bookings/checkout/payment",
  "web.booking.create": "/bookings/checkout/create-booking",
  "web.booking.confirmation": "/bookings/checkout/confirmation",
  "web.custom_booking.list": "/custom-bookings",
  "web.custom_booking.show": "/custom-bookings/:id",
  "web.custom_booking.summary": "/custom-bookings/checkout/summary",
  "web.service_requirement.list": "/service-requirements",
  "web.service_requirement.create": "/service-requirements",
  "web.service_requirement.show": "/service-requirements/:id",
  "web.account.profile": "/account/propfile",
  "web.account.profile.post": "/account/propfile",
  "web.account.security": "/account/security",
  "web.account.post": "/account/security",
  "web.account.settings": "/account/settings",
  "web.account.wishlist": "/account/wishlist",
  "web.account.wishlist.add_item": "/account/wishlist/add-item",
  "web.account.wishlist.remove_item": "/account/wishlist/remove-item",
  "web.account.wishlist.clear": "/account/wishlist/clear",
  "web.account.notifications": "/account/notifications",
  "api.requirements.show_bids": "/api/service-requirements/:id/show-bids",
  "api.requirements.show_accepted_bids": "/api/service-requirements/:id/accepted-bid",
  "api.requirements.negotiate_price": "/api/service-requirements/:id/negotiate-price",
  "api.requirements.vendor_placed_bids": "/api/service-requirements/:id/show-vendor-placed-bid",
  "api.requirements.my_list": "/api/service-requirements/my-list",
  "api.requirements.index": "/api/service-requirements",
  "api.requirements.store": "/api/service-requirements",
  "api.requirements.show": "/api/service-requirements/:id",
  "api.requirements.update": "/api/service-requirements/:id",
  "api.requirements.destroy": "/api/service-requirements/:id",
  "api.bids.accept-negotiate": "/api/bids/:id/accept-negotiate",
  "api.bids.index": "/api/bids",
  "api.bids.store": "/api/bids",
  "api.bids.show": "/api/bids/:id",
  "api.bids.update": "/api/bids/:id",
  "api.bids.destroy": "/api/bids/:id",
  "api.blogs.index": "/api/blogs",
  "api.blogs.store": "/api/blogs",
  "api.blogs.show": "/api/blogs/:id",
  "api.blogs.update": "/api/blogs/:id",
  "api.blogs.destroy": "/api/blogs/:id",
  "api.blog_categories.index": "/api/blog-categories",
  "api.blog_categories.store": "/api/blog-categories",
  "api.blog_categories.show": "/api/blog-categories/:id",
  "api.blog_categories.update": "/api/blog-categories/:id",
  "api.blog_categories.destroy": "/api/blog-categories/:id",
  "api.bookings.summary": "/api/bookings/summary",
  "api.bookings.my_list": "/api/bookings/my-list",
  "api.bookings.update_status": "/api/bookings/:id/update-status",
  "api.bookings.index": "/api/bookings",
  "api.bookings.store": "/api/bookings",
  "api.bookings.show": "/api/bookings/:id",
  "api.bid-bookings.my_list": "/api/bid-bookings/my-list",
  "api.bid-bookings.update_status": "/api/bid-bookings/:id/update-status",
  "api.bid_bookings.index": "/api/bid-bookings",
  "api.bid_bookings.store": "/api/bid-bookings",
  "api.bid_bookings.show": "/api/bid-bookings/:id",
  "api.coupons.applicable_coupons": "/api/coupons/applicable",
  "api.coupons.vendor_coupons": "/api/coupons/vendor-coupons",
  "api.coupons.index": "/api/coupons",
  "api.coupons.store": "/api/coupons",
  "api.coupons.show": "/api/coupons/:id",
  "api.coupons.update": "/api/coupons/:id",
  "api.coupons.destroy": "/api/coupons/:id",
  "api.chat.create_message": "/api/chat/conversations/:id/create-message",
  "api.chat.markall_asread": "/api/chat/conversations/:id/mark-all-as-read",
  "api.chat.get_messages": "/api/chat/conversations/:id/get-messages",
  "api.chat.index": "/api/chat/conversations",
  "api.chat.store": "/api/chat/conversations",
  "api.chat.show": "/api/chat/conversations/:id",
  "api.notifications.menu": "/api/notifications/get-menu-notifications",
  "api.notifications.mark_read": "/api/notifications/mark-as-read/:id",
  "api.notifications.destroy_read": "/api/notifications/delete/read",
  "api.notifications.destroy_all": "/api/notifications/delete/all",
  "api.notifications.index": "/api/notifications",
  "api.notifications.update": "/api/notifications/:id",
  "api.notifications.destroy": "/api/notifications/:id",
  "api.reviews.service": "/api/reviews/service-reviews/:serviceId",
  "api.reviews.vendor": "/api/reviews/venodr-reviews/:vendorId",
  "api.reviews.service.create": "/api/reviews/service-reviews",
  "api.reviews.vendor.create": "/api/reviews/venodr-reviews",
  "api.service.show": "/api/service/:slug",
  "api.service.destroy_images": "/api/service/delete-screenshot/:id",
  "api.service.my_list": "/api/service/my-list",
  "api.service.store": "/api/service",
  "api.service.update": "/api/service/:id",
  "api.service.destroy": "/api/service/:id",
  "api.service-category.show": "/api/service-category/:slug",
  "api.service_category.index": "/api/service-category",
  "api.service_category.store": "/api/service-category",
  "api.service_category.show": "/api/service-category/:id",
  "api.service_category.update": "/api/service-category/:id",
  "api.service_category.destroy": "/api/service-category/:id",
  "api.service-subcategory.show": "/api/service-subcategory/slug",
  "api.service_subcategory.index": "/api/service-subcategory/service-subcategory",
  "api.service_subcategory.store": "/api/service-subcategory/service-subcategory",
  "api.service_subcategory.show": "/api/service-subcategory/service-subcategory/:id",
  "api.service_subcategory.update": "/api/service-subcategory/service-subcategory/:id",
  "api.service_subcategory.destroy": "/api/service-subcategory/service-subcategory/:id",
  "api.service-tags.show": "/api/service-tags/:slug",
  "api.service_tags.index": "/api/service-tags",
  "api.service_tags.store": "/api/service-tags",
  "api.service_tags.show": "/api/service-tags/:id",
  "api.service_tags.update": "/api/service-tags/:id",
  "api.service_tags.destroy": "/api/service-tags/:id",
  "api.user.ban": "/api/users/ban/:id",
  "api.user.update_password": "/api/users/update-password/:id",
  "api.user.update": "/api/users/:id/update-profile",
  "api.user.index": "/api/users",
  "api.user.store": "/api/users",
  "api.user.show": "/api/users/:id",
  "api.user.destroy": "/api/users/:id",
  "api.wishlist.index": "/api/my-wishlist",
  "api.wishlist.index_detailed": "/api/my-wishlist/detailed",
  "api.wishlist.add_item": "/api/my-wishlist/add-item",
  "api.wishlist.remove_item": "/api/my-wishlist/:itemId",
  "api.wishlist.clear": "/api/my-wishlist"
};

export default function routes(
  routeName: keyof typeof routesObject,
  params: Array<string | number> = []
) {
  const route = routesObject[routeName]
  if (!route) {
    throw new Error(`Route name "${routeName}" not found in the map.`)
  }
  if (params.length === 0 || !/:/.test(route)) {
    return route
  }
  const parts = route.split('/')
  let paramIndex = 0
  const result = parts.map((part) => {
    if (part.startsWith(':') && paramIndex < params.length) {
      return params[paramIndex++]
    } else {
      return part
    }
  })
  return result.join('/')
}
