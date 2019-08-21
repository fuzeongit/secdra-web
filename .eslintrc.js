module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    "no-console":0,
    "vue/no-v-html":0,
    "vue/this-in-template":0,
    "vue/require-prop-type-constructor":0,
    "vue/no-side-effects-in-computed-properties":0,
    "no-extend-native":0
  }
}
