<script lang="ts" setup>
import { Link, usePage } from '@inertiajs/vue3'
import { layoutConfig } from '@layouts'
import { can } from '@layouts/plugins/casl'
import type { NavLink } from '@layouts/types'
import { getComputedNavLinkToProp, getDynamicI18nProps, isNavLinkActive } from '@layouts/utils'
import { IPageProps } from '../../../app/helpers/types'
import { computed } from 'vue'

interface Props {
  item: NavLink

  // ℹ️ We haven't added this prop in vertical nav because we don't need such differentiation in vertical nav for styling
  isSubItem?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSubItem: false,
})

const page = usePage<IPageProps<{}>>()
const currenUrl = computed(() => page.url)
</script>


<template>
  <li v-if="can(item.action, item.subject)" class="nav-link" :class="[
    {
      'sub-item': props.isSubItem,
      'disabled': item.disable,
    },
  ]">
    <Component :is="item.to ? Link : 'a'" v-bind="getComputedNavLinkToProp(item)"
      :class="{ 'router-link-active router-link-exact-active': isNavLinkActive(item, currenUrl) }">
      <Component :is="layoutConfig.app.iconRenderer || 'div'" class="nav-item-icon"
        v-bind="item.icon || layoutConfig.verticalNav.defaultNavItemIconProps" />
      <Component :is="layoutConfig.app.i18n.enable ? 'i18n-t' : 'span'" class="nav-item-title"
        v-bind="getDynamicI18nProps(item.title, 'span')">
        {{ item.title }}
      </Component>
    </Component>
  </li>
</template>

<style lang="scss">
.layout-horizontal-nav {
  .nav-link a {
    display: flex;
    align-items: center;
  }
}
</style>
