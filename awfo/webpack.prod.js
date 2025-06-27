const path = require('path')
const Dotenv = require('dotenv-webpack')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const config = require('./webpack.config')

module.exports = merge(config, {
  // 设置模式为生产模式
  mode: 'production',
  // 快速构建速度, 良好的调试支持
  devtool: 'source-map',
  output: {
    filename: 'js/[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'dist'),
    // 清理 /dist 文件夹
    clean: true,
  },
  plugins: [
    // 使用 dotenv 统一管理环境变量
    new Dotenv({
      path: './.env.production',
    }),
    // 定义全局常量
    new webpack.DefinePlugin({
      // 是否开启 devTools
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    }),
  ],
})
