import { DeliveryType, PaymentMode, PaymentStatus } from '#helpers/enums'
import { useForm } from '@inertiajs/vue3'
import { defineStore } from 'pinia'
import routes from '~/utils/routes'

const useBookingStore = defineStore('useBookingStore', () => {
  const form = useForm({
    couponId: '',
    qty: '',
    serviceVariantId: '',
    paymentdetail: {
      paymentMode: PaymentMode.ONLINE,
      paymentStatus: PaymentStatus.PAID,
    },
    addressDetail: {
      geoLocation: '',
      mapAddress: '',
      address: '',
      mobile: '',
    },
    deliveryType: DeliveryType.WALK_IN,
  })

  const submit = async (opt?: Parameters<(typeof form)['post']>[1]) => {
    form.post(routes('web.booking.create'), opt)
  }

  return {
    form,
    submit,
  }
})

export default useBookingStore
