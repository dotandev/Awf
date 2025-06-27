const postcssPresetEnv = require('postcss-preset-env')
const postcssMixins = require('postcss-mixins')
const cssnano = require('cssnano')
const postcssNormalize = require('postcss-normalize')
const stylelint = require('stylelint')
const tailwindcss = require('tailwindcss')

module.exports = {
  plugins: [
    stylelint(),
    tailwindcss,
    postcssMixins,
    postcssNormalize({ forceImport: 'sanitize.css' }),
    cssnano({
      preset: 'default',
    }),
    postcssPresetEnv({ stage: 1 }),
  ],
}
