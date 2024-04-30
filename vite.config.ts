import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.ts' } }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'swiper-container' || tag === 'swiper-slide',
        },
      },
    }),
    adonisjs({ entrypoints: ['inertia/app/app.ts'], reload: ['resources/views/**/*.edge'] }),
    vuetify({
      styles: {
        configFile: './inertia/assets/styles/variables/_vuetify.scss',
      },
    }),
    svgLoader(),
  ],
  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
      '@/': `${getDirname(import.meta.url)}/`,
      '@themeConfig/': `${getDirname(import.meta.url)}/inertia/themeConfig.ts/`,
      '@core/': `${getDirname(import.meta.url)}/inertia/@core/`,
      '@layouts/': `${getDirname(import.meta.url)}/inertia/@layouts/`,
      '@images/': `${getDirname(import.meta.url)}/inertia/assets/images/`,
      '@styles/': `${getDirname(import.meta.url)}/inertia/assets/styles/`,
      '@configured-variables/': `${getDirname(import.meta.url)}/inertia/assets/styles/variables/_template.scss/`,
      '#controllers/': `${getDirname(import.meta.url)}/app/controllers/`,
      '#exceptions/': `${getDirname(import.meta.url)}/app/exceptions/`,
      '#models/': `${getDirname(import.meta.url)}/app/models/`,
      '#mails/': `${getDirname(import.meta.url)}/app/mails/`,
      '#services/': `${getDirname(import.meta.url)}/app/services/`,
      '#listeners/': `${getDirname(import.meta.url)}/app/listeners/`,
      '#events/': `${getDirname(import.meta.url)}/app/events/`,
      '#middleware/': `${getDirname(import.meta.url)}/app/middleware/`,
      '#validators/': `${getDirname(import.meta.url)}/app/validators/`,
      '#providers/': `${getDirname(import.meta.url)}/providers/`,
      '#policies/': `${getDirname(import.meta.url)}/app/policies/`,
      '#abilities/': `${getDirname(import.meta.url)}/app/abilities/`,
      '#database/': `${getDirname(import.meta.url)}/database/`,
      '#tests/': `${getDirname(import.meta.url)}/tests/`,
      '#start/': `${getDirname(import.meta.url)}/start/`,
      '#config/': `${getDirname(import.meta.url)}/config/`,
      '#helpers/': `${getDirname(import.meta.url)}/app/helpers/",`,
    },
  },
  build: {
    chunkSizeWarningLimit: 5000,
    target: 'esnext',
  },
  esbuild: {
    target: 'esnext',
    supported: {
      'top-level-await': true,
    },
  },
  optimizeDeps: {
    exclude: ['vuetify', 'vue-flatpickr-component', 'flatpickr'],
    entries: ['./inertia/**/*.vue'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  ssr: {
    noExternal: ['@inertiajs/server', /\.css$/, /\?vue&type=style/, /^vuetify/],
  },
})
