import { App } from 'vue'
import * as vt from 'vue-toastification'

// Import the CSS or use your own!
import 'vue-toastification/dist/index.css'

const options: vt.PluginOptions = {}

export default function (app: App) {
  app.use(vt.default, options)
}
