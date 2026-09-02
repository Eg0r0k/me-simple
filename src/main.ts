import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from 'motion-v'
import '@/style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
/* Даёт директиву v-motion на любом элементе, без обёртки <motion.*>. */
app.use(MotionPlugin)

app.mount('#app')
