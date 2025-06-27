import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例对象
const pinia = createPinia()
// 注册 Pinia 持久化插件
pinia.use(piniaPluginPersistedstate)

// 导出 Pinia 实例对象
export default pinia
