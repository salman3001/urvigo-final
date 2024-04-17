/// <reference path="../../adonisrc.ts" />
import { createInertiaApp } from '@inertiajs/vue3'
import { renderToString } from '@vue/server-renderer'
import { createPinia } from 'pinia'
import { createSSRApp, h, type DefineComponent } from 'vue'
import { registerPlugins } from '~/@core/utils/plugins'

const pinia = createPinia()

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = import.meta.glob<DefineComponent>('../pages/**/*.vue', { eager: true })
      return pages[`../pages/${name}.vue`]
    },

    setup({ App, props, plugin }) {
      const app = createSSRApp({ render: () => h(App, props) })
        .use(plugin)
        .use(pinia)

      registerPlugins(app)

      return app
    },
  })
}
