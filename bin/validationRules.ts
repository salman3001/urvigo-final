import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

const numberLessThanRule = (
  value: unknown,
  options: {
    value: number
  },
  field: FieldContext
) => {
  field.data
  if (typeof value !== 'string') {
    return
  }

  if (options.value < (field.value as unknown as number)) {
    return
  } else {
    field.report(`The Field {{field }} must be less than ${options.value}`, 'numberLessThan', field)
  }
}

export const numberLessThan = vine.createRule(numberLessThanRule)
