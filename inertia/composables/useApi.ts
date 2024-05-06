import type { AxiosError, AxiosRequestConfig } from 'axios'
import { ref } from 'vue'
import api from '~/utils/axios'
import * as vt from 'vue-toastification'
import type { IResType } from '#helpers/types'

export default function useApi<T>(url: string, method: 'get' | 'post' | 'put' | 'delete') {
  const processing = ref(false)
  const data = ref<T | null>(null)

  const error = ref<null | string | undefined>(null)

  const exec = async (
    config: AxiosRequestConfig,
    opt?: { onSuccess?: () => void; onError?: () => void }
  ) => {
    processing.value = true
    error.value = null
    api[method]<IResType<any>>(url, config)
      .then((res) => {
        data.value = res.data.data
        processing.value = false
        if (res.data.success === true) {
          opt?.onSuccess && opt?.onSuccess()
        }
      })
      .catch((err: AxiosError<IResType<T>>) => {
        const resData = err.response?.data
        error.value = resData?.message

        if (resData?.success === false) {
          opt?.onError && opt?.onError()
          if (!import.meta.env.SSR) {
            const toast = vt.useToast()
            toast.error(resData?.message || 'Error Resposse')
          }
        }
      })
  }

  return {
    data,
    exec,
    processing,
    error,
  }
}
