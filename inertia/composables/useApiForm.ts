import type { AxiosError, AxiosRequestConfig } from 'axios'
import { reactive } from 'vue'
import api from '~/utils/axios'
import type { IResType } from '#helpers/types'
import { pickKeysFromReference } from '~/utils/helpers'

export default function useApiForm<T extends Object>(initialForm: T) {
  const formObject = reactive({
    ...initialForm,
    processing: false,
    error: null as string | null,
    async post(
      url: string,
      config?: AxiosRequestConfig,
      opt?: { onSucess?: () => void; onError?: () => void }
    ) {
      this.error = null
      this.processing = true
      try {
        const res = await api.post<IResType<any>>(
          url,
          pickKeysFromReference(this, initialForm),
          config
        )
        if (res.data.success === true) {
          opt?.onSucess && opt.onSucess()
        }
      } catch (error: unknown) {
        this.error = (error as AxiosError<IResType<any>>).response?.data?.error || null
        opt?.onError && opt.onError()
      }
      this.processing = false
    },
    async put(
      url: string,
      config?: AxiosRequestConfig,
      opt?: { onSucess?: () => void; onError?: () => void }
    ) {
      this.error = null
      this.processing = true
      try {
        const res = await api.put<IResType<any>>(
          url,
          pickKeysFromReference(this, initialForm),
          config
        )
        if (res.data.success === true) {
          opt?.onSucess && opt.onSucess()
        }
      } catch (error: unknown) {
        this.error = (error as AxiosError<IResType<any>>).response?.data?.error || null
        opt?.onError && opt.onError()
      }
      this.processing = false
    },
    async delete(
      url: string,
      config?: AxiosRequestConfig,
      opt?: { onSucess?: () => void; onError?: () => void }
    ) {
      this.error = null
      this.processing = true
      try {
        const res = await api.delete<IResType<any>>(url, config)
        if (res.data.success === true) {
          opt?.onSucess && opt.onSucess()
        }
      } catch (error: unknown) {
        this.error = (error as AxiosError<IResType<any>>).response?.data?.error || null
        opt?.onError && opt.onError()
      }
      this.processing = false
    },
  })

  return formObject
}
