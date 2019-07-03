const pkg = require('./package');


module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Secdra - 想你所想',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'application-name', name: 'application-name', content: "Secdra"},
      {hid: 'keywords', name: 'keywords', content: "secdra,pixiv,二次元,插画,开源项目"},
      {hid: 'description', name: 'description', content: "Secdra是一个采集pixiv为素材而开发的一个开源网站。目前还在优化更新中..."}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {rel: 'stylesheet', type: 'text/css', href: '//at.alicdn.com/t/font_896802_f3v4vbehy3e.css'},
    ]
  },
  /*
   ** Global CSS
   */
  css: [
    {src: '@/assets/style/index.less', lang: 'less'},
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: {
    name: 'nuxt',
    color: '#fb7299',
    background: '#fff'
  },


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
};
