import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import {
  BaseModel,
  afterCreate,
  belongsTo,
  column,
  hasMany,
  hasOne,
  manyToMany,
} from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { userTypes } from '#helpers/enums'
import UserProfile from './user_profile.js'
import type { BelongsTo, HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import Notification from './notification.js'
import Booking from './booking.js'
import Wishlist from './wishlist.js'
import BidBooking from './bid_booking.js'
import Conversation from './conversation.js'
import ServiceCategory from './service_category.js'
import Role from './role.js'
import BusinessProfile from './business_profile.js'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare phone: string | null

  @column()
  declare userType: userTypes

  @column()
  declare roleId: number | null

  @column()
  declare isActive: boolean

  @column({ serializeAs: null })
  declare socketToken: boolean

  @column({ serializeAs: null })
  declare otp: number | string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @hasOne(() => UserProfile)
  declare profile: HasOne<typeof UserProfile>

  @hasOne(() => BusinessProfile)
  declare businessProfile: HasOne<typeof BusinessProfile>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  @hasMany(() => Booking)
  declare bookings: HasMany<typeof Booking>

  @hasOne(() => Wishlist)
  declare wishlist: HasOne<typeof Wishlist>

  @hasMany(() => BidBooking)
  declare bidBooking: HasMany<typeof BidBooking>

  @manyToMany(() => Conversation, {
    pivotTable: 'conversation_participants',
  })
  declare conversations: ManyToMany<typeof Conversation>

  @manyToMany(() => ServiceCategory, {
    pivotTable: 'user_subscribed_categories',
  })
  declare subscribedCategories: ManyToMany<typeof ServiceCategory>

  @afterCreate()
  static async createCommons(user: User) {
    await user.related('profile').create({})
    await user.related('wishlist').create({})
  }
}
