<template>
  <header class="animated duration" :class="{fadeInDown:isShow&&hid,fadeOutUp:!isShow}">
    <nav>
      <nuxt-link to="/">
        <img src="../../../assets/image/logo/logo.svg" height="30px" style="vertical-align: -5px;">
      </nuxt-link>
      <nuxt-link to="/hot" :class="{active:activeName===`hot`}">
        发现
      </nuxt-link>
      <nuxt-link to="/new" :class="{active:activeName===`new`}">
        最新
      </nuxt-link>
      <nuxt-link to="/upload" :class="{active:activeName===`upload`}">
        上传
      </nuxt-link>
      <nuxt-link to="/collection" :class="{active:activeName===`collection`}">
        收藏
      </nuxt-link>
      <nuxt-link to="/footprint" :class="{active:activeName===`footprint`}">
        足迹
      </nuxt-link>
      <template>
        <div class="right-box">
          <input type="search" title="search" class="input-blue is-plain" @search="search" v-model="tag"
                 placeholder="输入标签搜索">
          <i class="fa fa-search"></i>
          <div class="head-img-box" @mouseover="isShowUserPopover = true">
            <nuxt-link :to="`/user/${user.id||''}`">
              <img src="../../../assets/image/bk/login-bk.jpg" width="40" height="40"
                   style="border-radius: 50%;margin-left: 30px">
            </nuxt-link>
            <ul @click.stop="()=>{}" v-show="isShowUserPopover" @mouseleave="isShowUserPopover=false">
              <li>
                <a>
                  <i class="fa fa-question-circle-o"></i>
                  没有想到
                </a>
              </li>
              <li>
                <a @click="logout">
                  <i class="fa fa-power-off"></i>
                  退出登录
                </a>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </nav>
  </header>
</template>

<script>
  import Cookie from 'js-cookie'
  export default {
    props: {
      offset: {
        type: Number,
        default: 150
      },
      activeName: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        scrollTop: 0,
        hid: false,
        tag: "",
        isShowUserPopover: false,
      }
    },
    watch: {
      $route(newVal) {
        this.isShowUserPopover = false
      }
    },
    computed: {
      isShow() {
        let isShow = this.scrollTop < this.offset;
        if (!isShow && !this.hid) {
          this.hid = true
        }
        return isShow
      },
      user() {
        return this.$store.state.user.user || {}
      }
    },
    mounted() {
      this.scrollTop = document.documentElement.scrollTop;
      document.addEventListener('scroll', (event) => {
        this.scrollTop = event.target.documentElement.scrollTop
      });
      document.addEventListener('click', () => {
        this.isShowUserPopover = false
      })
    },
    methods: {
      search() {

      },
      logout() {
        Cookie.remove("token");
        this.$router.replace("/login")
      },
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";

  header {
    height: @herder-height;
    font-size: @big-font-size;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0 0 4px rgba(202, 202, 202, 0.55);
    border-bottom: 1px solid #e2e2e2;
    background-color: @white;
    z-index: 10;
    nav {
      width: @visual-width;
      margin: 0 auto;
      font-size: 0;
      .right-box {
        line-height: @herder-height;
        float: right;
        .head-img-box {
          display: inline-block;
          position: relative;
          ul {
            position: absolute;
            background-color: white;
            padding: 0 15px;
            width: 150px;
            right: 0;
            top: 0;
            margin-top: @herder-height+@herder-border-height+10px;
            &:before {
              position: absolute;
              display: block;
              width: 0;
              height: 0;
              content: "";
              top: -10px;
              right: 10px;
              margin-left: -6px;
              border: 10px solid transparent;
              border-top-width: 0;
              border-bottom-color: #fff;
            }
            li {
              border-bottom: 1px solid @border-color;
              line-height: 45px;
              &:last-child {
                border-bottom: none;
              }
              a {
                color: @theme-color;
                display: inline-block;
                height: 100%;
                font-size: @medium-font-size;
                .fa {
                  font-size: @medium-font-size;
                }
              }
            }
          }
          &:hover {

          }
        }
      }
      > a {
        display: inline-block;
        line-height: @herder-height;
        color: @theme-color;
        padding: 0 20px;
        font-size: @big-font-size;
        &.active {
          color: @white;
          background-color: @theme-color;
        }
      }
      .fa {
        font-size: @big-font-size;
        color: @theme-color;
      }
    }
  }
</style>
