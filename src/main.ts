import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from 'motion-v'
import { i18n } from '@/app/i18n'
import { useSetupRootClasses } from '@/composables/useSetupRootClasses'
import '@/style.css'
import App from './App.vue'
import router from './router'

useSetupRootClasses()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
/* Даёт директиву v-motion на любом элементе, без обёртки <motion.*>. */
app.use(MotionPlugin)

app.mount('#app')
