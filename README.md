
# Secdra  
一个类似**pixiv**（下称p站）的网站，项目实现基于vue的ssr框架nuxt，使用es6和less，除了popper和cropperjs没有借助第三方UI组件，所有UI组件参考element-ui造轮子。    
项目大致基于vue-cli初始化，需求分析，设计具体风格，规划目录结构，开撸。    
项目大体实现功能是登录注册，上传图片，收藏图片，关注用户，评论回复，修改各种信息等。    
还有，样式部分只考虑了chrome浏览器，若在其他浏览器上存在样式错乱的问题请移步chrome内核的浏览器  
项目api来源于[secdra](https://github.com/JunJieFu/secdra)，完全实现前后端分离。    
图片来源p站，通过[Pxer](https://github.com/FoXZilla/Pxer)采集到七牛云上。    
  
注：    
注册和修改功能已经实现，但是暂时不对外开放。  
初始化了50个账号，账号名为1-50，密码不用填，初始化账号中，随机收藏图片和关注用户。    
上传功能也实现，但是由于图片的上传涉及审核，所以暂时不开放uploadToken。    
#### 快速链接  
官网：[www.secdra.com](http://www.secdra.com)  
  
#### 关于项目  
在设计项目初期，就觉得pixiv的插画真的挺好看的，但是国内也没有类似的网站，就想自己弄一个来玩玩。  
在本项目中，不借助第三方的UI组件，而是通过阅读组件源码而重新开发。其实这样做有主要是为了了解该实现方式，巩固基础，还有就是对于自身个性化定制更好。在样式上使用less能更好定制主题样式，通过变量能更好得管理全局样式。使用[ES6](http://es6.ruanyifeng.com/)语法，在项目中用async/await处理事件响应，项目使用jsDoc注释。  
  
#### 关于UI  
由于本人不是UI出身，美感不是很好，在这方面也是花时间比较多，所以就不断去借鉴其他网站的设计，图标使用了阿里图标，提示图片使用了B站和游民星空的图片，侵删。  
主题颜色可以通过less设置。  
  
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
``` bash 
 proxy: [      
	[    
		 '/api', {    
			target: "http://127.0.0.1:8080", // api主机    
		    secure: false,    
			changeOrigin: true,    
			pathRewrite: {'^/api': '/'}    
		}    
	],  
	[
		'/webSocket', { 
			target: "http://127.0.0.1:8080/webSocket", // api主机 
			ws:true, 
			secure: false, 
			changeOrigin: true, 
			pathRewrite: {'^/webSocket': '/'} 
		}
	] 
]  
``` 
#### 交互体验  
这方面是我在项目中比较注重的，在大量的切换的都使用了过渡效果，使页面看起来比较顺滑，动画实现主要是通过animation.css来实现的。~~在滚动过程中，滚动的高度会被记录到store中，所以在任何地方只需通过store就能取到文档的滚动高度。在项目中，滚动条是不可见的，所以在过长的页面都会配有回到最上的按钮。该按钮由于会比较常用，所以把回到顶部的事件作为了一个指令。  ~~

上述的高度如果记录在store中会造成大量的写入，从而导致页面在滚动的时候回造成卡顿，解决办法是通过mixin来解决，在用户需要用到滚动监听的地方会直接使用mixin，在mixin中会暴露scrollTop和scrollBottom两个属性。在监听滚动是为了节约性能的消耗方面，使用了请求动画帧，以下是滚动监听部分代码
``` bash 
documentScroll(event) {  
  if(!this._requestAnimationFrameTick) {  
    requestAnimationFrame(()=>{  
      this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;  
      this.scrollBottom = document.body.scrollHeight - this.scrollTop - event.target.documentElement.clientHeight;  
      this._requestAnimationFrameTick = false;  
    });  
    this._requestAnimationFrameTick = true;  
  }  
}
```
去掉了当时的go-top指令，吧gotop做成了一个组件，组件滚动动画不在依赖js来计算，而是通过原生的scrollTo的option的behavior属性值smooth来完成

对于原来还有许多功能改进，在ui层面上更加符合Material Design设计规范
然后在功能上的改进首当其冲的就是在点击上增加了波纹反馈，这个波纹反馈来自vuetify上的v-ripple，在开发初期我的目的主要就是不依赖第三方ui框架，所以这个v-ripple指令也只是通过vuetify上的源码提取出来的。其次就是手动增加了选择日期组件，其实日历本不难，但是年月日切换时的上下翻的动画这个让我没有想到好办法，最后唯有通过$mount()来维持这个动画。

再之就是加入了webSocket，其实项目不大，这个倒没有什么必要，但是毕竟是开源项目，所以我就想它的知识面尽量覆盖广一点；由于这个是一个服务端渲染的，这个socket连接的时机真的想了我很久，最后才决定在layout上链接，然后建立一个mixin，在引入mixin后，可以自定义一个stompSubscribeList方法，这个方法返回StompSubscribe集合，然后mixin会在适当地时机去订阅这个方法。

最后，由于本人也不是什么大神，所以有错误的地方和需要改进的地方请给位与本人交流。

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
  
# run $ npm run build  
$ pm2 start npm --name web -- run start  
```  
  
#### 开源协议  
[MIT](https://opensource.org/licenses/MIT)

#### 后语
由于想实现多应用登录，该项目已经不作更新，新项目请移步

[zeongit-beauty-web](https://github.com/JunJieFu/zeongit-beauty-web)

官网如下

[beauty.secdra.com](http://beauty.secdra.com)
