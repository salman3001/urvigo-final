/// <reference path="../../adonisrc.ts" />
import { createSSRApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
// import 'vuetify/styles'
import '../@core/scss/template/index.scss'
import '../assets/styles/styles.scss'
import { createPinia } from 'pinia'
import { registerPlugins } from '~/@core/utils/plugins'

const appName = import.meta.env.VITE_APP_NAME || 'Urvigo'

const pinia = createPinia()

createInertiaApp({
  progress: { color: '#5468FF',showSpinner:true },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    )
  },

  setup({ el, App, props, plugin }) {
    const app = createSSRApp({ render: () => h(App, props) })
      .use(plugin)
      .use(pinia)

    registerPlugins(app)
    app.mount(el)
  },
})
