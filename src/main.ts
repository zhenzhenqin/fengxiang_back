import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

//导入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import router from './router'
import {createPinia} from "pinia"



createApp(App)
.use(router)
.use(createPinia())
.use(ElementPlus)
.mount('#app')
