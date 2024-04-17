import { IPageProps } from '#helpers/types'
import { usePage } from '@inertiajs/vue3'
import { watch } from 'vue'
import * as vt from 'vue-toastification'

export default function useInjectToast() {
  const page = usePage<IPageProps<{}>>()

  watch(
    () => page.props.flash,
    (n) => {
      if (n && !import.meta.env.SSR) {
        const toast = vt.useToast()
        if (n.type === 'success') {
          toast.success(n.message)
        }

        if (n.type === 'info') {
          toast.info(n.message)
        }

        if (n.type === 'warning') {
          toast.warning(n.message)
        }

        if (n.type === 'error') {
          toast.error(n.message)
        }
      }
    },
    { immediate: true }
  )
}
