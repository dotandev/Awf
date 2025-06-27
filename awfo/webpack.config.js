const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const AutoImportApis = require('unplugin-auto-import/webpack')
const AutoImportComponents = require('unplugin-vue-components/webpack')
const webpack = require('webpack')

const resolve = (dir) => path.resolve(__dirname, dir)

module.exports = {
  // 入口文件配置，告诉 webpack 从哪个文件开始打包
  entry: './src/main.ts',
  // 配置模块如何解析，例如导入时省略文件扩展名
  resolve: {
    // 告诉 Webpack 当导入一个目录时, 默认查找名为 index 的文件
    mainFiles: ['index'],
    // 自动解析确定的扩展，能够使用户在引入模块时不带扩展
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    // 配置路径别名
    alias: {
      // 使 webpack 在进行打包时能够识别路径别名
      '@': resolve('src'),
      '@apis': resolve('src/apis'),
      '@images': resolve('src/assets/images'),
      '@layouts': resolve('src/layouts'),
      '@router': resolve('src/router'),
      '@shared': resolve('src/shared'),
      '@stores': resolve('src/stores'),
      '@styles': resolve('src/assets/styles'),
      '@views': resolve('src/views'),
      '@utils': resolve('src/utils'),
      '@plugins': resolve('src/plugins'),
      '@directives': resolve('src/directives'),
    },
  },
  module: {
    rules: [
      {
        // 使用正则表达式匹配文件扩展名, 这里是匹配 .tsx? 文件
        test: /\.(js|ts)x?$/,
        // 排除 node_modules 目录下的文件, 这些文件不需要通过 babel-loader 处理
        exclude: /node_modules/,
        // 指定使用 babel-loader 来处理匹配到的文件
        // babel-loader 会根据 .babelrc 配置文件对 ts 文件中的代码进行转换
        // 用于将 TypeScript (或 ES6+) 代码转换为兼容旧版浏览器的 JavaScript 代码
        use: 'babel-loader',
      },
      {
        // 匹配 .vue 文件
        test: /\.vue$/,
        // 使用 vue-loader 来处理匹配到的文件
        loader: 'vue-loader',
      },
      {
        // 匹配 .css 文件
        test: /\.p?css$/,
        // 使用 style-loader 和 css-loader 来处理匹配到的文件
        use: ['vue-style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        // 使用正则表达式匹配图像文件 (png, jpg, jpeg, gif, svg)
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        // 自动选择资源应该被转换为内联的 base64 URI 还是作为单独的文件输出
        type: 'asset',
        // 配置输出目录和文件名, 以及转换为 base64 的条件
        generator: {
          filename: 'images/[name].[hash][ext]',
        },
        parser: {
          // 将小于 10kb 的图片转换为 base64 格式
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        // 使用正则表达式匹配视频文件 (mp4)
        test: /\.mp4$/,
        // 不对资源本身进行处理, 直接拷贝到目标目录
        type: 'asset/resource',
        // 配置输出目录和文件名
        generator: {
          filename: 'videos/[name].[hash][ext]',
        },
      },
    ],
  },
  plugins: [
    // 创建一个 VueLoaderPlugin 实例，并将其添加到 webpack 的插件列表中
    new VueLoaderPlugin(),
    // HtmlWebpackPlugin 插件用于简化 HTML 文件的创建
    // 它会自动生成一个 HTML5 文件，并将所有的 webpack bundles 自动注入到这个文件中
    new HtmlWebpackPlugin({
      // 指定模板文件的路径。这里使用的是 "src/index.html"
      // 插件会根据这个模板生成最终的 HTML 文件
      // 这意味着你可以在模板文件中预先定义好 HTML 的结构、引入的资源等
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
    // 在 webpack 插件数组中实例化 ESLintPlugin
    new ESLintPlugin({
      // 指定插件检查的文件扩展名
      extensions: ['js', 'vue', 'ts'],
    }),
    // 配置 API 的自动导入
    AutoImportApis.default({
      // 要转换的目标
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          '@vueuse/core': [],
          axios: [
            // axios 采用默认导入的方式
            // import { default as axios } from 'axios'
            ['default', 'axios'],
          ],
          'axios-retry': [
            // axios-retry 采用默认导入的方式
            ['default', 'axiosRetry'],
          ],
        },
        {
          // 导入 axios 中提供的类型
          from: 'axios',
          imports: ['InternalAxiosRequestConfig'],
          type: true,
        },
      ],
      // 根据文件名自动确定默认导出的名称
      defaultExportByFilename: true,
      // 根据文件名自动导出的目录
      dirs: ['./src/apis/*', './src/utils/*'],
      // 在 vue 单文件组件的模板中启用自动导入
      vueTemplate: true,
      // 为 TS 生成类型声明文件
      dts: 'src/types/auto-import.d.ts',
    }),
    // 配置组件的自动导入
    AutoImportComponents.default({
      // 自动导入框架组件
      resolvers: [],
      // 指定自动导入组件的目录
      dirs: ['src/shared', 'src/views'],
      // 深度搜索
      deep: true,
      // 指定 TS 类型声明文件的生成位置
      dts: 'src/types/components.d.ts',
      // 组件类型
      extensions: ['vue', 'tsx', 'jsx'],
    }),
    // 定义全局常量
    new webpack.DefinePlugin({
      // 设置为 true 如果你需要使用 Options API
      __VUE_OPTIONS_API__: JSON.stringify(false),
      // 是否开启服务端渲染
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
    }),
  ],
}
