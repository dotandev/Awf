import { App } from 'vue'

// 可选参数
interface Options {}

export default {
  install: (app: App, options?: Options): void => {
    // 测试代码, 可删除
    console.log(app, options)
  },
}
