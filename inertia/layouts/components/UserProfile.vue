<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3'
import avatar from '~/assets/images/dummy-avatar.webp'
import useAuth from '~/composables/useAuth'
import useGetImageUrl from '~/composables/useGetImageUrl'
import routes from '~/utils/routes'

const getImageUrl = useGetImageUrl()
const { user, isVendor } = useAuth()
</script>

<template>
  <VBadge dot location="bottom right" offset-x="3" offset-y="3" bordered color="success">
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg :src="getImageUrl(user?.profile?.avatar?.thumbnailUrl, avatar)" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                  <VAvatar color="primary" variant="tonal">
                    <VImg :src="getImageUrl(user?.profile?.avatar?.thumbnailUrl, avatar)" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ user?.firstName + ' ' + user?.lastName }}
            </VListItemTitle>
            <VListItemSubtitle><span class="normalcase">{{ user?.userType }}</span></VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 dashboard -->
          <Link :href="routes('vendor.dashboard')" v-if="isVendor()">
          <VListItem link>

            <template #prepend>
              <VIcon class="me-2" icon="tabler-brand-envato" size="22" />
            </template>
            <VListItemTitle>Dashboard</VListItemTitle>
          </VListItem>
          </Link>

          <!-- 👉 Profile -->
          <Link :href="routes('web.account.profile')">
          <VListItem link>

            <template #prepend>
              <VIcon class="me-2" icon="tabler-user" size="22" />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>
          </Link>

          <!-- 👉 chat -->
          <Link :href="routes('web.chat')">
          <VListItem link>

            <template #prepend>
              <VIcon class="me-2" icon="tabler-mail-opened" size="22" />
            </template>

            <VListItemTitle>Messages</VListItemTitle>
          </VListItem>
          </Link>

          <!-- 👉 Settings -->
          <Link :href="routes('web.account.settings')">
          <VListItem link>

            <template #prepend>
              <VIcon class="me-2" icon="tabler-settings" size="22" />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>
          </Link>

          <!-- 👉 Bookings -->
          <Link :href="routes('web.booking.list')">
          <VListItem link>

            <template #prepend>
              <VIcon class="me-2" icon="tabler-shopping-cart" size="22" />
            </template>

            <VListItemTitle>Booking</VListItemTitle>
          </VListItem>
          </Link>

          <!-- 👉 Custom Bookings -->
          <Link :href="routes('web.custom_booking.list')">
          <VListItem link>

            <template #prepend>
              <VIcon class="me-2" icon="tabler-shopping-cart" size="22" />
            </template>

            <VListItemTitle>Custom Booking</VListItemTitle>
          </VListItem>
          </Link>

          <!-- 👉 Wishlist -->
          <Link :href="routes('web.account.wishlist')">
          <VListItem link>

            <template #prepend>
              <VIcon class="me-2" icon="tabler-heart" size="22" />
            </template>

            <VListItemTitle>Wishlist</VListItemTitle>
          </VListItem>
          </Link>

          <!-- 👉 Notification -->
          <Link :href="routes('web.account.notifications')">
          <VListItem link>

            <template #prepend>
              <VIcon class="me-2" icon="tabler-bell" size="22" />
            </template>

            <VListItemTitle>Notification</VListItemTitle>
          </VListItem>
          </Link>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <Link :href="routes('web.auth.logout')">
          <VListItem>

            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
          </Link>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
~/utils/routes-old
