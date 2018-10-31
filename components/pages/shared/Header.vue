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
          <i class="s-chaxun icon"></i>
          <div class="head-img-box">
            <a @click.stop="isShowUserOptions=true">
              <img src="" width="40" height="40"
                   :onerror="`this.src='${require('../../../assets/image/default/default-head.jpg')}'`"
                   style="border-radius: 50%;">
            </a>
            <ul v-show="isShowUserOptions" @click.stop="()=>{}">
              <li>
                <nuxt-link :to="`/user/${user.id||''}`" :class="{active:activeName===`user`}">
                  <i class="icon s-question"></i>
                  个人中心
                </nuxt-link>
              </li>
              <li>
                <a @click="logout">
                  <i class="icon s-zhuxiao"></i>
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
        isShowUserOptions: false
      }
    },
    watch: {
      $route() {
        this.isShowUserOptions = false
      },
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
        this.isShowUserOptions = false;
      })
    },
    methods: {
      search() {

      },
      logout() {
        this.isShowUserOptions = false;
        this.$confirm({
          message: `你确定要退出登录吗？`,
          okCallback: () => {
            Cookie.remove("token");
            this.$router.replace("/login")
          }
        });
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
      height: @herder-nav-height;
      line-height: @herder-nav-height;
      > a {
        display: inline-block;
        color: @font-color;
        padding: 0 20px;
        font-size: @medium-font-size;
        &.active {
          color: @theme-color;
          border-bottom: (@herder-height - @herder-nav-height) solid @theme-color;
        }
      }
      .icon {
        font-size: @big-font-size + 4px;
      }
      .right-box {
        line-height: @herder-height;
        float: right;
        .head-img-box {
          display: inline-block;
          position: relative;
          padding-left: 30px;

          ul {
            position: absolute;
            background-color: white;
            padding: 0 15px;
            width: 120px;
            right: 0;
            top: 8px;
            border: 1px solid @border-color;
            margin-top: @herder-height - @herder-border-height;
            box-shadow: 0 0 10px rgba(202, 202, 202, 0.55);
            text-align: center;
            &:before {
              content: "";
              position: absolute;
              display: block;
              width: 10px;
              height: 10px;
              transform: rotate(45deg);
              top: -7px;
              right: 12px;
              background: @white;
              border: 1px solid @border-color;
              border-bottom: 0;
              border-right: 0;
            }
            li {
              border-bottom: 1px solid @border-color;
              line-height: 45px;
              &:last-child {
                border-bottom: none;
              }
              a {
                color: @font-color;
                display: inline-block;
                height: 100%;
                font-size: @default-font-size;
                &.active {
                  color: @theme-color;
                  .icon {
                    color: @theme-color;
                  }
                }
                .icon {
                  font-size: @medium-font-size + 2px;
                  vertical-align: -1px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>