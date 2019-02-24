const pkg = require('./package');


module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'Secdra',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: pkg.description}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {rel: 'stylesheet', type: 'text/css', href: '//at.alicdn.com/t/font_896802_45g3y7tp55w.css'},
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    name: 'nuxt',
    color: '#fb7299',
    background: '#fff'
  },

  /*
  ** Global CSS
  */
  css: [
    {src: '../assets/style/index.less', lang: 'less'},
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/mixin',
    '~/plugins/route',
    '~/plugins/extend'
  ],


  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/proxy',
    '@nuxtjs/axios'
  ],
  proxy: [
    [
      '/api',
      {
        target: "http://127.0.0.1:8080", // api主机
        secure: false,
        changeOrigin: true,
        pathRewrite: {'^/api': '/'}
      }
    ]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    },
    optimization: {},

    // optimizeCSS: {}//压缩css

    /**
     * 打包独立css文件
     */
    extractCSS: true,
  }
}
