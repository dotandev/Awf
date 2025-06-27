const path = require('path')
const Dotenv = require('dotenv-webpack')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const config = require('./webpack.config')

module.exports = merge(config, {
  // 设置模式为开发模式
  mode: 'development',
  // 快速构建速度, 良好的调试支持
  devtool: 'eval-source-map',
  output: {
    filename: 'js/[name].[fullhash:8].js',
    path: path.resolve(__dirname, 'dist'),
  },
  // 本地开发服务器
  devServer: {
    // 可以指定端口号
    port: 8080,
    // 开启热模块替换
    hot: true,
    // 当设置 historyApiFallback: true 时
    // 开发服务器会将所有的 404 响应重定向到 index.html 页面
    // 这对于使用前端路由的单页面应用特别有用
    // 因为它确保在刷新页面或直接访问子路由时, 能够正确地加载应用程序的入口文件。
    historyApiFallback: true,
    // 客户端设置
    client: {
      // 只输出错误信息
      logging: 'error',
    },
  },
  plugins: [
    // 使用 dotenv 统一管理环境变量
    new Dotenv({
      path: './.env.development',
    }),
    // 定义全局常量
    new webpack.DefinePlugin({
      // 是否开启 devTools
      __VUE_PROD_DEVTOOLS__: JSON.stringify(true),
    }),
  ],
})
