<script setup lang="ts">
import { useConfigStore } from '~/@core/stores/config'
import type { ThemeSwitcherTheme } from '~/@layouts/types'
import { ref, watch } from 'vue'

const props = defineProps<{
  themes: ThemeSwitcherTheme[]
}>()

const configStore = useConfigStore()

const selectedItem = ref([configStore.theme])

// Update icon if theme is changed from other sources
watch(
  () => configStore.theme,
  () => {
    selectedItem.value = [configStore.theme]
  },
  { deep: true }
)
</script>

<template>
  <div>
    <IconBtn color="rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))">
      <VIcon :icon="props.themes.find((t) => t.name === configStore.theme)?.icon" size="24" />

      <VTooltip activator="parent" open-delay="1000" scroll-strategy="close">
        <span class="text-capitalize">{{ configStore.theme }}</span>
      </VTooltip>

      <VMenu activator="parent" offset="12px" :width="180">
        <VList v-model:selected="selectedItem" mandatory>
          <VListItem
            v-for="{ name, icon } in props.themes"
            :key="name"
            :value="name"
            :prepend-icon="icon"
            color="primary"
            class="text-capitalize"
            @click="
              () => {
                configStore.theme = name
              }
            "
          >
            {{ name }}
          </VListItem>
        </VList>
      </VMenu>
    </IconBtn>
  </div>
</template>
