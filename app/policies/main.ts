/*
|--------------------------------------------------------------------------
| Bouncer policies
|--------------------------------------------------------------------------
|
| You may define a collection of policies inside this file and pre-register
| them when creating a new bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

export const policies = {
  BlogPolicy: () => import('#policies/blog_policy'),
  CampaignPolicy: () => import('#policies/campaign_policy'),
  ContactMessagePolicy: () => import('#policies/contact_message_policy'),
  KnowledgebasePolicy: () => import('#policies/knowledgebase_policy'),
  LocationPolicy: () => import('#policies/location_policy'),
  RolePolicy: () => import('#policies/role_policy'),
  ServicePolicy: () => import('#policies/service_policy'),
  SubscriberPolicy: () => import('#policies/subscriber_policy'),
  SupportTicketPolicy: () => import('#policies/support_ticket_policy'),
  TemplatePolicy: () => import('#policies/template_policy'),
  userPolicy: () => import('#policies/user_policy'),
  IntrestPolicy: () => import('#policies/interest_policy'),
  NotificationPolicy: () => import('#policies/notification_policy'),
  MediaPolicy: () => import('#policies/media_policy'),
  ReviewPolicy: () => import('#policies/review_policy'),
  BussinessPolicy: () => import('#policies/business_policy'),
  WishlistPolicy: () => import('#policies/wishlist_policy'),
  BookingPolicy: () => import('#policies/booking_policy'),
  CouponPolicy: () => import('#policies/coupon_policy'),
  ServiceRequirementPolicy: () => import('#policies/service_requirment_policy'),
  BidPolicy: () => import('#policies/bid_policy'),
  BidBookingPolicy: () => import('#policies/bid_booking_policy'),
  ServiceCategoryPolicy: () => import('#policies/service_category_policy'),
  ConversationPolicy: () => import('#policies/conversation_policy'),
  TimeslotPlanPolicy: () => import('#policies/timeslot_plan_policy'),
}
