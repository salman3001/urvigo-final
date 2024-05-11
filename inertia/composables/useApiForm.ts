import type { AxiosError, AxiosRequestConfig } from 'axios'
import { reactive, watch } from 'vue'
import api from '~/utils/axios'
import type { IResType } from '#helpers/types'
import { pickKeysFromReference } from '~/utils/helpers'
import * as vt from 'vue-toastification'

export default function useApiForm<T extends object>(
  initialForm: T,
  options?: { disableToast?: boolean }
) {
  const formObject = reactive({
    ...initialForm,
    res: undefined as undefined | IResType<any>,
    processing: false,
    error: null as Record<any, any> | null,
    disableToast: options?.disableToast || false,
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
        this.res = res.data
      } catch (error: unknown) {
        this.res = (error as AxiosError<IResType<any>>).response?.data
        const errors = (error as AxiosError<IResType<any>>).response?.data?.errors

        if (errors && errors.length > 0) {
          const errorObj: Record<any, any> = {}
          errors.forEach((e) => {
            errorObj[e.field] = e.message
          })
          this.error = errorObj
        } else {
          this.error = null
        }
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
        this.res = res.data
      } catch (error: unknown) {
        const errors = (error as AxiosError<IResType<any>>).response?.data?.errors
        this.res = (error as AxiosError<IResType<any>>).response?.data

        if (errors && errors.length > 1) {
          const errorObj: Record<any, any> = {}
          errors.forEach((e) => {
            errorObj[e.field] = e.message
          })
          this.error = errorObj
        } else {
          this.error = null
        }
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
        this.res = res.data
      } catch (error: unknown) {
        const errors = (error as AxiosError<IResType<any>>).response?.data?.errors
        this.res = (error as AxiosError<IResType<any>>).response?.data

        if (errors && errors.length > 1) {
          const errorObj: Record<any, any> = {}
          errors.forEach((e) => {
            errorObj[e.field] = e.message
          })
          this.error = errorObj
        } else {
          this.error = null
        }
        opt?.onError && opt.onError()
      }
      this.processing = false
    },
  })

  watch(
    () => formObject.res,
    (n) => {
      if (n && !import.meta.env.SSR && !formObject.disableToast) {
        const toast = vt.useToast()
        if (n.success === true) {
          toast.success(n.message || ' Success')
        }
        if (n.success === false) {
          toast.error(n.message || 'Error')
        }
      }
    }
  )

  return formObject
}
