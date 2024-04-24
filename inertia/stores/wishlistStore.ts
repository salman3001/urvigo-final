import type Wishlist from '#models/wishlist'
import { defineStore } from 'pinia'
import useApi from '~/composables/useApi'
import routes from '~/utils/routes'
// import { useWishlistApi } from '~/composables/api/useWishlistApi'

const wishlistStore = defineStore('wishlistStore', () => {
  const { data: wishlistItems, exec: fetchWishlist } = useApi<Wishlist>(
    routes('api.wishlist.index'),
    'get'
  )

  const isWishlisted = (serviceId: number) => {
    const matchedItem = wishlistItems?.value?.items
      ? wishlistItems?.value?.items.filter((i) => i.id === serviceId)
      : []

    if (matchedItem.length > 0) {
      return true
    } else {
      false
    }
  }

  return {
    wishlistItems,
    fetchWishlist,
    isWishlisted,
  }
})

export default wishlistStore
