<template>
  <header class="animated duration" :class="{fadeInDown:isShow&&hid,fadeOutUp:!isShow}">
    <nav>
      <nuxt-link to="/">
        <img src="../../../assets/image/logo/logo.svg" height="30px" style="vertical-align: -5px;">
      </nuxt-link>
      <nuxt-link to="/find" :class="{active:activeName===`find`}">
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
          <input type="search" title="search" class="input is-plain" @search="search" v-model="tag"
                 placeholder="输入标签搜索">
          <a @click="search">
            <i class="s-chaxun icon"></i>
          </a>
          <div class="head-img-box">
            <nuxt-link :to="`/user/${user.id||''}`">
              <img :src="$img.head(user.head)" width="40" height="40" v-popover:popover
                   :onerror="`this.src='${require('../../../assets/image/default/default-head.jpg')}'`"
                   style="border-radius: 50%;">
            </nuxt-link>
            <Popper ref="popover"
                    trigger="hover">
              <ul class="head-menu">
                <li>
                  <nuxt-link :to="`/user/${user.id||''}`" :class="{active:activeName===`user`}">
                    <i class="icon s-zhanghaoguanli"></i>
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
            </Popper>
          </div>
        </div>
      </template>
    </nav>
  </header>
</template>

<script>
  import Cookie from 'js-cookie'

  export default {
    components: {},
    props: {
      offset: {
        type: Number,
        default: 150
      }
    },
    data() {
      return {
        hid: false,
        tag: "",
      }
    },
    watch: {
      $route() {
        this.scrollTop = 0;
        document.documentElement.scrollTop = 0
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
      },
      activeName() {
        return this.$store.state.menu.name
      },
      scrollTop: {
        get() {
          return this.$store.state.window.scrollTop || 0
        },
        set(val) {
          this.$store.state.window.scrollTop = val || 0
        }
      }
    },
    mounted() {
      document.addEventListener('scroll', this.documentScroll);
    },
    beforeDestroy() {
      document.removeEventListener('scroll', this.documentScroll);
    },
    methods: {
      documentScroll(event) {
        this.scrollTop = event.target.documentElement.scrollTop;
        this.$store.state.window.scrollBottom = event.target.documentElement.scrollHeight - this.scrollTop - event.target.documentElement.clientHeight
      },
      search() {
        this.$router.push(`/draw/search/${this.tag}`)
      },
      logout() {
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
    min-width: @window-min-width;
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
        }
      }
    }
  }

  .head-menu {
    background-color: white;
    padding: 0 15px;
    width: 120px;
    border-radius: @smallest-border-radius;
    text-align: center;
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
</style>

