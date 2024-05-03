<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import axios from 'axios'
import { ref } from 'vue'
import AppAutocomplete from '~/@core/components/app-form-elements/AppAutocomplete.vue'

const loading = ref(false)
const search = ref()
const select = ref(null)

const emits = defineEmits<{
  (
    e: 'selection',
    opt: {
      coordinates: string
      mapAddress: string
    }
  ): void
}>()

interface resultType {
  type: string
  features: [
    {
      type: 'Feature'
      geometry: {
        coordinates: [number, number]
        type: 'Point'
      }
      properties: {
        osm_id?: 9469727487
        country?: string
        city?: string
        countrycode?: string
        postcode?: string
        county?: string
        type?: string
        osm_type?: string
        osm_key?: string
        housenumber?: string
        street?: string
        district?: string
        osm_value?: string
        name?: string
      }
    },
  ]
}

const items = ref<resultType['features'] | []>([])

const querySelections = (query: string) => {
  loading.value = true

  axios
    .get<resultType>('https://photon.komoot.io/api', {
      params: {
        q: query,
      },
    })
    .then((data) => {
      if (data.data) {
        items.value = data?.data?.features || []
      }
      loading.value = false
    })
    .catch(() => {
      if (import.meta.env.DEV) {
        items.value = [
          {
            geometry: {
              coordinates: [20.2, 81.5],
              type: 'Point',
            },
            properties: {
              name: 'There is error or you may be offiline',
              city: 'Click this option to populate fake address',
            },
            type: 'Feature',
          },
        ]
      }
      loading.value = false
    })
}

watchDebounced(
  search,
  (value) => {
    value && value !== select.value && querySelections(value)
  },
  {
    debounce: 1000,
    maxWait: 1500,
  }
)

const resolveCordinates = (item: resultType['features'][0]) =>
  `${item?.geometry?.coordinates[0]},${item?.geometry?.coordinates[1]}`
const resolveTitle = (item: resultType['features'][0]) => item?.properties?.name
const resolveSubtitle = (item: resultType['features'][0]) =>
  `${item?.properties?.housenumber || ''} ${item?.properties?.street || ''} ${item?.properties?.city || ''} ${item?.properties?.district || ''} ${item?.properties?.county || ''} ${item?.properties?.country || ''}`

const onUpdate = (v: resultType['features'][0]) => {
  emits('selection', {
    coordinates: resolveCordinates(v),
    mapAddress: resolveSubtitle(v),
  })
}
</script>

<template>
  <AppAutocomplete
    v-model="select"
    v-model:search="search"
    :loading="loading"
    :items="items"
    placeholder="Search for a location"
    label="location"
    :menu-props="{ maxHeight: '200px' }"
    @update:model-value="onUpdate"
    no-filter
    variant="plain"
  >
    <template #selection="{ item }">
      {{ item?.props?.title?.properties?.name }}
    </template>
    <template #item="{ props, item }">
      <VListItem
        v-bind="props"
        :title="resolveTitle(item?.value)"
        :subtitle="resolveSubtitle(item?.value)"
      />
    </template>
  </AppAutocomplete>
</template>
