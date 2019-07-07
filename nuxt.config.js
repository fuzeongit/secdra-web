const env = (function () {
  return {
    baseUrl: process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : "http://www.secdra.com/api",
    qiniuImg: process.env.NODE_ENV === "development" ? "http://secdraimg.secdra.com" : "http://secdraimg.secdra.com",
    qiniuHead: process.env.NODE_ENV === "development" ? "http://secdrahead.secdra.com" : "http://secdrahead.secdra.com",
    qiniuBack: process.env.NODE_ENV === "development" ? "http://secdraback.secdra.com" : "http://secdraback.secdra.com",
    qiniuUploadAddress: process.env.NODE_ENV === "development" ? "http://upload-z2.qiniup.com" : "http://upload-z2.qiniup.com",
    qiniuSeparator: process.env.NODE_ENV === "development" ? "-" : "-",
  }
})();

module.exports = {
  mode: 'universal',
  env,
  server: {
    port: 3000
  },
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
  css: [
    {src: '@/assets/style/index.less', lang: 'less'},
  ],
  loading: {
    name: 'nuxt',
    color: '#fb7299',
    background: '#fff'
  },
  plugins: [
    '~/plugins/mixin',
    '~/plugins/route',
    '~/plugins/extend'
  ],
  modules: [
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
  axios: {
    baseURL:env.baseUrl
  },
  build: {
    extend(config, ctx) {

    },
    optimization: {},
    //打包独立css文件
    extractCSS: true,
  }
};
