<script lang="ts" setup>
import { Link, usePage } from '@inertiajs/vue3'
import { layoutConfig } from '~/@layouts'
import { can } from '~/@layouts/plugins/casl'
import { useLayoutConfigStore } from '~/@layouts/stores/config'
import type { NavLink } from '~/@layouts/types'
import { getComputedNavLinkToProp, getDynamicI18nProps, isNavLinkActive } from '~/@layouts/utils'
import { IPageProps } from '../../../app/helpers/types'
import { computed } from 'vue'

defineProps<{
  item: NavLink
}>()

const page = usePage<IPageProps<{}>>()
const currenUrl = computed(() => page.url)

const configStore = useLayoutConfigStore()
const hideTitleAndBadge = configStore.isVerticalNavMini()
</script>

<template>
  <li v-if="can(item.action, item.subject)" class="nav-link" :class="{ disabled: item.disable }">
    <Component
      :is="item.to ? Link : 'a'"
      v-bind="getComputedNavLinkToProp(item)"
      :class="{ 'custom-active-link': isNavLinkActive(item, currenUrl) }"
    >
      <TransitionGroup name="transition-slide-x">
        <!-- 👉 Title -->
        <Component
          :is="layoutConfig.app.i18n.enable ? 'i18n-t' : 'span'"
          v-show="!hideTitleAndBadge"
          key="title"
          class="nav-item-title"
          v-bind="getDynamicI18nProps(item.title, 'span')"
        >
          {{ item.title }}
        </Component>

        <!-- 👉 Badge -->
        <Component
          :is="layoutConfig.app.i18n.enable ? 'i18n-t' : 'span'"
          v-if="item.badgeContent"
          v-show="!hideTitleAndBadge"
          key="badge"
          class="nav-item-badge"
          :class="item.badgeClass"
          v-bind="getDynamicI18nProps(item.badgeContent, 'span')"
        >
          {{ item.badgeContent }}
        </Component>
      </TransitionGroup>
    </Component>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-link a {
    display: flex;
    align-items: center;
  }
}

.custom-active-link {
  box-shadow:
    0 3px 8px rgba(var(--v-shadow-key-umbra-color), 0.14),
    0 0 transparent,
    0 0 transparent;
  background: linear-gradient(270deg, rgba(#7367f0, 0.7) 0%, #7367f0 100%) !important;
}
</style>
