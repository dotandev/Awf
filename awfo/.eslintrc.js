module.exports = {
  // 表示当前配置为根配置，ESLint 在向上查找配置文件时会停止
  root: true,
  env: {
    // 启用浏览器全局变量
    browser: true,
    // 启用 ES2021 语法支持
    es2021: true,
    // 启用 Node.js 全局变量和 Node.js 作用域
    node: true,
  },
  extends: [
    // 启用一组核心规则
    'eslint:recommended',
    // 使用 Vue 3 推荐的规则
    'plugin:vue/vue3-recommended',
    // 启用 Vue 官方推荐的 TypeScript 规则
    '@vue/typescript/recommended',
    // 启用 eslint-plugin-prettier 推荐的规则
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    // 指定 ECMAScript 版本为 2021
    ecmaVersion: 2021,
  },
  rules: {
    // 在这里添加自定义规则或覆盖默认规则
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
