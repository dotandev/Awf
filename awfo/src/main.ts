import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@router/index'
import pinia from '@stores/index'
import globalComponents from '@plugins/global-components'
import globalDirectives from '@plugins/global-directives'
import '@styles/base.pcss'

// 创建应用实例
const app = createApp(App)
// 注册路由插件
app.use(router)
// 注册 Pinia 全局状态管理插件
app.use(pinia)
// 注册全局组件
app.use(globalComponents)
// 注册全局指令
app.use(globalDirectives)
// 挂载应用
app.mount('#app')
