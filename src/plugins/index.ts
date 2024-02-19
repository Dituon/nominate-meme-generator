/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import draggable from "vuedraggable";
import contenteditable from "vue-contenteditable";

// Types
import type {App} from 'vue'

export function registerPlugins (app: App) {
  app.use(vuetify)
    .component('draggable', draggable)
    .component('contenteditable', contenteditable)
}
