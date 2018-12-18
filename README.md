# Secdra
一个类似**pixiv**（下称p站）的网站，项目实现基于vue的ssr框架nuxt，使用es6和less，除了popper和cropperjs没有借助第三方UI组件，所有UI组件参考element-ui造轮子。  
项目大致基于vue-cli初始化，需求分析，设计具体风格，规划目录结构，开撸。  
项目大体实现功能是登录注册，上传图片，收藏图片，修改各种信息等。  
还有，样式除了Chrome内核的浏览器所有不支持，所以要想看展示的请用Chrome内核的浏览器。  
项目api来源于[secdra](https://github.com/JunJieFu/secdra)，完全实现前后端分离。  
图片来源p站，通过[Pxer](https://github.com/FoXZilla/Pxer)采集到七牛云上。  

注：  
注册和修改功能已经实现，但是没有开放，暂时初始化了50个账号，账号名为1-50，密码不用填。  
上传功能也实现，但是由于图片的上传涉及审核，所以暂时不开放uploadToken。  
#### 快速链接
官网：[www.secdra.com](http://www.secdra.com)

#### 关于项目
在本项目中，不借助第三方的UI组件，而是通过阅读组件源码而重新开发，其实这样做有主要是为了了解该实现方式，巩固基础，还有就是对于自身个性化定制更好。在样式上使用less能更好定制主题样式，通过变量能更好得管理全局样式。使用大量[ES6](http://es6.ruanyifeng.com/)语法，在项目中用async/await处理事件响应，解决回调地狱，项目使用jsDoc注释。

#### 技术栈
 - Vue
 - Nuxt
 - Less
 - Vuex
 - Vue-Router
 - Axios

#### 项目结构
![](https://github.com/JunJieFu/static-image/blob/master/secdra-web/catalog.png)

#### 数据处理
数据交互是通过axios来发送，然后通过nuxt的proxy将数据接口地址代理到api上

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

#### 交互体验
这方面是我在项目中比较注重的，在大量的切换的都使用了过渡效果，使页面看起来比较顺滑，动画实现主要是通过animation.css来实现的。在滚动过程中，滚动的高度会被记录到store中，所以在任何地方只需通过store就能取到文档的滚动高度。在项目中，滚动条是不可见的，所以在过长的页面都会配有回到最上的按钮。该按钮由于会比较常用，所以把回到顶部的事件作为了一个指令。

#### 构建
``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```
由于在正式发布中多数会用到pm2来管理node进程
``` bash
# install pm2
$ npm install -g pm2

# run 
$ npm run build
$ pm2 start npm -- run start
```

#### 开源协议
[MIT](https://opensource.org/licenses/MIT)
