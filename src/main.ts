import { createApp } from 'vue'
import { createPinia } from 'pinia' // 新增
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './assets/index.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App)
const pinia = createPinia() // 新增
pinia.use(piniaPluginPersistedstate)
app.use(i18n)
app.use(router)
app.use(pinia) // 新增
app.mount('#app')
