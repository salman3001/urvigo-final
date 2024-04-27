import { usePage } from '@inertiajs/vue3'
import type { IPageProps } from '../../app/helpers/types'
import { computed } from 'vue'
import { userTypes } from '../../app/helpers/enums'

export default function useAuth() {
  const page = usePage<IPageProps<{}>>()
  const user = computed(() => page?.props?.user)

  const isUser = () => {
    return user.value?.userType === userTypes.USER
  }

  const isVendor = () => {
    return user.value?.userType === userTypes.VENDER
  }

  const isAdmin = () => {
    return user.value?.userType === userTypes.ADMIN
  }

  return {
    user,
    isAdmin,
    isVendor,
    isUser,
  }
}
