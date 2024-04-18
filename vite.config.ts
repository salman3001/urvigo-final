import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { fileURLToPath } from 'node:url'

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
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [fileURLToPath(new URL('./inertia/plugins/i18n/locales/**', import.meta.url))],
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
    exclude: ['vuetify'],
    entries: ['./inertia/**/*.vue'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  ssr: {
    noExternal: ['@inertiajs/server', /\.css$/, /\?vue&type=style/, /^vuetify/],
  },
})
