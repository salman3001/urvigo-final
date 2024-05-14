import env from '#start/env'
import { inject } from '@adonisjs/core'
import RazorPay from 'razorpay'
import {
  validatePaymentVerification,
  validateWebhookSignature,
} from 'razorpay/dist/utils/razorpay-utils.js'

@inject()
export default class PaymentService {
  rozor: null | RazorPay = null
  constructor() {
    this.rozor = new RazorPay({
      key_id: env.get('RAZOR_KEY_ID'),
      key_secret: env.get('RAZOR_KEY_SECRETE'),
    })
  }

  /**
   *  Creates order and returns string customer_id or 'failed' string. create a customer on razor pay before creating a order
   */
  async createCustomer(opt: {
    contact: string | number
    email: string
    fullName: string
  }): Promise<'failed' | string> {
    try {
      const data = await this.rozor?.customers.create({
        email: opt.email,
        contact: opt.contact,
        name: opt.fullName,
      })
      if (data) {
        return data.id
      } else {
        return 'failed'
      }
    } catch (error) {
      return 'failed'
    }
  }

  /**
   *  Creates order and returns string order_id or 'failed' string. send this order id to frontend checkout page
   */
  async createOrder(opt: {
    amount: string | number
    currency: string
    customerId: string
    recieptNo: string
    firstMinAmount?: number
    methods?: 'card' | 'upi' | 'netbanking'
    isPartalPaymentAllowed?: boolean
  }): Promise<'failed' | string> {
    try {
      const data = await this.rozor?.orders.create({
        amount: opt.amount,
        currency: opt.currency,
        customer_id: opt.customerId,
        receipt: opt.recieptNo,
        first_payment_min_amount: opt.firstMinAmount,
        method: opt.methods,
        partial_payment: opt.isPartalPaymentAllowed,
      })
      if (data) {
        return data.id
      } else {
        return 'failed'
      }
    } catch (error) {
      return 'failed'
    }
  }

  /**
   *  varify payment signature. get the response from frontend and varify using this method. Returns true or false
   */
  verifyPaymentSignature(opt: {
    razorPaymentId: string
    razorOrderId: string
    razorSignature: string
  }): boolean {
    return validatePaymentVerification(
      { order_id: opt.razorOrderId, payment_id: opt.razorPaymentId },
      opt.razorSignature,
      env.get('RAZOR_KEY_SECRETE')
    )
  }

  /**
   *  varify payment signature. get the response from frontend and varify using this method. Returns true or false
   */
  verifyWebhookEvent(opt: { webHookBody: object; webhookSignature: string }): boolean {
    return validateWebhookSignature(
      JSON.stringify(opt.webHookBody),
      opt.webhookSignature,
      env.get('RAZOR_WEBHOOK_SECRETE')
    )
  }
}
