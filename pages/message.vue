<template>
  <section class="container bk cover page">
    <div class="content row">
      <div class="left-box card">
        <h4 class="title"><strong><i class="icon s-xinxizhongxin"></i>消息中心</strong></h4>
        <ul class="list">
          <li @click="$router.push(item.type)" :class="{active:(type===item.type)}" v-for="item in menuList" :key="item.type">{{item.name}}</li>
        </ul>
      </div>
      <div class="right-box card">
        <transition name="fade" enter-active-class="fadeIn duration" leave-active-class="fadeOut duration">
          <nuxt-child/>
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
  class Menu {
    constructor(type,name){
      this.type = type;
      this.name = name;
    }
  }
  export default {
    data() {
      return {
        type: "comment",
        menuList:[
          new Menu('comment','评论我的'),
          new Menu('reply','回复我的'),
          new Menu('follow','收到的赞'),
          new Menu('system','系统通知')
        ]
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";

  .bk {
    background-image: url("../assets/image/bk/message-bk.png");
    height: calc(100vh - (@herder-height + @herder-border-height));
  }

  .content {
    width: @visual-width;
    margin: 0 auto;
    height: 100%;
    .left-box {
      width: 150px;
      float: left;
      height: 100%;
      border-radius: 0;
      background-color: hsla(0, 0%, 100%, .8);
      .title {
        font-size: @default-font-size;
        line-height: 60px;
        .icon {
          margin-right: 10px;
        }
      }
      .list {
        padding-left: 20px;
        li {
          user-select: none;
          font-size: @default-font-size;
          color: @gray;
          display: block;
          line-height: 40px;
          cursor: pointer;
          text-align: left;
          font-weight: 400;
          &:before {
            content: " ";
            display: inline-block;
            margin-right: 10px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: @gray;
          }
          &.active, &:hover {
            color: @theme-color;
            &:before {
              background-color: @theme-color;
            }
          }
        }
      }
    }
    .right-box {
      padding: 10px;
      height: 100%;
      width: 960px;
      float: right;
      border-radius: 0;
      background-color: hsla(0, 0%, 100%, .8);
    }
  }
</style>
