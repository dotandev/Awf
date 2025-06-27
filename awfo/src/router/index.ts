import { createRouter, createWebHistory } from 'vue-router'

// 创建路由实例
const router = createRouter({
  // 使用 Web 历史记录模式
  history: createWebHistory(),
  // 路由配置
  routes: [
    {
      path: '',
      component: () => import('@layouts/main-layout.vue'),
      children: [
        {
          // 路径为 "/"，加载 home-page 组件
          path: '',
          component: () => import('@views/home/home-page.vue'),
        },
      ],
    },
  ],
})
// 导出路由实例对象
export default router
