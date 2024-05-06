import type { CookieParseOptions, CookieSerializeOptions } from 'cookie-es'
import { parse, serialize } from 'cookie-es'
import { destr } from 'destr'
import type { Ref } from 'vue'
import { ref, watch } from 'vue'

// eslint-disable-next-line @typescript-eslint/naming-convention
type _CookieOptions = Omit<CookieSerializeOptions & CookieParseOptions, 'decode' | 'encode'>

export interface CookieOptions<T = any> extends _CookieOptions {
  decode?(value: string): T
  encode?(value: T): string
  default?: () => T | Ref<T>
  watch?: boolean | 'shallow'
}

export type CookieRef<T> = Ref<T>

const CookieDefaults: CookieOptions<any> = {
  path: '/',
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === 'string' ? val : JSON.stringify(val)),
}

export const useCookie = <T = string | null | undefined>(
  name: string,
  _opts?: CookieOptions<T>
): CookieRef<T> => {
  const opts = { ...CookieDefaults, ...(_opts || {}) }
  const cookie = ref<T | undefined>(undefined)

  const updateCookie = () => {
    const cookies = parse(document.cookie, opts as any)

    cookie.value = (cookies[name] as any) ?? opts.default?.()
  }

  if (!import.meta.env.SSR) {
    updateCookie()
    watch(cookie, () => {
      document.cookie = serializeCookie(name, cookie.value, opts)
    })
  } else {
    cookie.value = opts.default?.()
  }

  return cookie as CookieRef<T>
}

function serializeCookie(name: string, value: any, opts: CookieSerializeOptions = {}) {
  if (value === null || value === undefined) return serialize(name, value, { ...opts, maxAge: -1 })

  return serialize(name, value, opts)
}
