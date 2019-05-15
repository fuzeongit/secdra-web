<template>
  <section class="container bk cover page">
    <div class="content row">
      <div class="left-box card">
        <h4 class="title"><strong><i class="icon s-xinxizhongxin"></i>消息中心</strong></h4>
        <ul class="list">
          <li @click="$router.push(key)" :class="{active:(type===key),settings:(key===`settings`)}"
              v-for="(item,key) in menuList" :key="key">
            <i class="icon s-shezhi" v-if="key===`settings`"></i>
            {{item}}
            <span class="message-count" v-if="key!==`settings`&&$store.state.message[key+`Count`]">
              {{$store.state.message[key+"Count"]|toMore}}
            </span>
          </li>
        </ul>
      </div>
      <div class="right-box card">
        <div class="card title">
          {{menuList[type]}}
        </div>
        <div class="message">
          <transition name="fade" enter-active-class="fadeIn duration" leave-active-class="fadeOut duration">
            <nuxt-child/>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  class Menu {
    constructor(type, name) {
      this.type = type;
      this.name = name;
    }
  }

  export default {
    asyncData({store}) {
      store.state.menu.name = "message";
    },
    data() {
      return {
        menuList: {
          comment: '评论我的',
          reply: '回复我的',
          follow: '关注我的',
          system: '系统通知',
          settings: '消息设置',
        },
      }
    },
    computed:{
      type(){
        return this.$store.state.message.type
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";
  @import "../assets/style/mixin";

  .bk {
    /*background-image: url("../assets/image/bk/message-bk.png");*/
    /*background-image: url("../assets/image/bk/login-bk.jpg");*/
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
        font-size: @small-font-size;
        line-height: 60px;
        .icon {
          margin-right: 10px;
        }
      }
      .list {
        padding-left: 20px;
        li {
          user-select: none;
          font-size: @small-font-size;
          color: @font-color-dark;
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
            background-color: @icon-color-dark;
          }
          &.active, &:hover {
            color: @theme-color;
            &:before {
              background-color: @theme-color;
            }
          }
          &.settings {
            padding-left: 18px;
            border-top: 1px solid white;
            margin-left: -20px;
            &:before {
              display: none;
            }
            .icon {
              margin-right: 7px
            }
          }
          .message-count {
            font-size: @smallest-font-size;
            height: 16px;
            line-height: 16px;
            color: white;
            background-color: @theme-color;
            padding: 0 5px;
            border-radius: 8px;
            margin-left: 10px;
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
      @title-height: 40px;
      @margin: 10px;
      .title {
        padding: 0 30px;
        line-height: @title-height;
        text-align: left;
        margin-bottom: @margin;
      }
      .message {
        height: calc(100% - @margin - @title-height);
      }
    }
  }
</style>
