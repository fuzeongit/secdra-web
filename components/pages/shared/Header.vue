<template>
  <header class="animated duration" :class="{fadeInDown:isShow&&hid,fadeOutUp:!isShow}">
    <nav>
      <nuxt-link to="/" :class="{active:activeName===`home`}" v-ripple>
        <!--<img src="../../../assets/image/svg/logo.svg" height="30px">-->
        主站
      </nuxt-link>
      <nuxt-link to="/find" :class="{active:activeName===`find`}" v-ripple>
        发现
      </nuxt-link>
      <nuxt-link to="/new" :class="{active:activeName===`new`}" v-ripple>
        最新
      </nuxt-link>
      <nuxt-link :to="`/collection/${user.id||''}`" :class="{active:activeName===`collection`}" v-ripple>
        收藏
      </nuxt-link>
      <nuxt-link :to="`/works/${user.id||''}`" :class="{active:activeName===`works`}" v-ripple>
        作品
      </nuxt-link>
      <template>
        <div class="right-box">
          <nuxt-link to="/message/comment" class="link icon s-xinxizhongxin" :class="{active:activeName===`message`}"
                     v-ripple>
            <span class="message-count" v-if="messageCount">{{messageCount|toMore}}</span>
          </nuxt-link>
          <template>
            <nuxt-link :to="`/user/${user.id||''}`" class="head-box" v-ripple>
              <img :src="$img.head(user.head,'small50')" width="30" height="30" v-popover:popover
                   :onerror="`this.src='${require('../../../assets/image/default/default-head.jpg')}'`"
                   style="border-radius: 50%">
            </nuxt-link>
            <Popper ref="popover"
                    trigger="hover"
                    :visibleArrow="false">
              <div class="head-popover">
                <div class="bk cover" :style="{backgroundImage: `url(${$img.back(user.background,`backCard`)})`}"></div>
                <p class="name">{{user.name}}</p>
                <p class="introduction" :title="user.introduction">{{user.introduction}}</p>
                <ul class="head-menu">
                  <li>
                    <nuxt-link :to="`/follower/${user.id||''}`" :class="{active:activeName===`follower`}"
                               v-ripple>
                      <i class="icon s-guanzhu1"></i>
                      我的粉丝
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link :to="`/following/${user.id||''}`" :class="{active:activeName===`following`}"
                               v-ripple>
                      <i class="icon s-guanzhu1"></i>
                      关注用户
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/footprint" :class="{active:activeName===`footprint`}"
                               v-ripple>
                      <i class="icon s-zuji"></i>
                      我的足迹
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/upload" :class="{active:activeName===`upload`}"
                               v-ripple>
                      <i class="icon s-upload"></i>
                      我要上传
                    </nuxt-link>
                  </li>
                </ul>
                <div class="footer">
                  <Btn flat icon @click="logout" small title="退出登录">
                    <i class="icon s-zhuxiao"></i>
                  </Btn>
                </div>
              </div>
            </Popper>
          </template>
        </div>
      </template>
    </nav>
  </header>
</template>

<script>
  import Cookie from 'js-cookie'
  import {mapState, mapActions} from "vuex"
  import windowMixin from "../../../assets/script/mixin/window";
  import stompUtil from "../../../assets/script/util/stompUtil";

  export default {
    componentName: "Header",
    mixins: [windowMixin],
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
        window.scrollTo(0, 0)
      },
    },
    computed: {
      ...mapState('menu', {activeName: 'name'}),
      ...mapState('user', ['user']),
      isShow() {
        let isShow = this.scrollTop < this.offset;
        if (!isShow && !this.hid) {
          this.hid = true
        }
        return isShow
      },
      messageCount() {
        return (this.$store.state.message.commentCount + this.$store.state.message.replyCount + this.$store.state.message.followCount + this.$store.state.message.systemCount)
      }
    },

    methods: {
      ...mapActions("socket", ["ASocketDisconnect"]),
      search() {
        this.$router.push(`/draw/search/${this.tag}`)
      },
      logout() {
        this.$confirm({
          message: `你确定要退出登录吗？`,
          okCallback: async () => {
            await this.ASocketDisconnect();
            Cookie.remove("token");
            this.$router.replace("/login")
          }
        });
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  header {
    height: @herder-height;
    font-size: @small-font-size;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0 0 4px rgba(202, 202, 202, 0.55);
    background-color: white;
    z-index: 10;
    min-width: @window-min-width;
    user-select: none;
    nav {
      width: @visual-width;
      margin: 0 auto;
      font-size: 0;
      height: @herder-nav-height;
      line-height: @herder-nav-height;
      > a {
        display: inline-block;
        color: @font-color-dark;
        padding: 0 20px;
        font-size: @small-font-size;
        border-bottom: (@herder-height - @herder-nav-height) solid white;
        &.active, &:hover {
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
        .message-count {
          font-size: @smallest-font-size;
          height: @default-font-size;
          line-height: @default-font-size;
          color: white;
          background-color: @theme-color;
          padding: 0 5px;
          border-radius: @default-font-size / 2;
          position: absolute;
          top: 4px;
          right: 4px;
        }
        .link {
          display: inline-block;
          padding: 0 20px;
          position: relative;
          font-size: @big-font-size;
          &.active, &:hover {
            color: @theme-color;
          }
        }
        .head-box {
          vertical-align: top;
          display: inline-block;
          position: relative;
          padding: 0 10px;
          color: @theme-color;
        }
      }
    }
  }

  .head-popover {
    @size: 280px;
    .bk {
      height: @size / 2;
      width: @size;
    }
    .name {
      text-align: center;
      font-weight: bold;
      margin: 25px 0 0;
    }
    .introduction {
      .ellipsis--clamp(2);
      width: @size;
      padding: 0 25px;
      margin: 10px 0;
      text-indent: 2em;
      color: @font-color-dark-fade;
      font-size: @smallest-font-size;
    }

    .head-menu {
      @gap: 8px;
      width: @size;
      background-color: white;
      text-align: center;
      user-select: none;
      display: grid;;
      justify-content: space-evenly;
      align-content: space-evenly;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: @gap;
      padding: @gap;
      li {
        a {
          color: @font-color-dark;
          display: block;
          font-size: @smallest-font-size;
          line-height: 28px;
          &.active, &:hover {
            color: @theme-color;
            .icon {
              color: @theme-color;
            }
          }
          .icon {
            font-size: @default-font-size;
            vertical-align: -1px;
          }
        }
      }
    }

    .footer {
      margin-top: 15px;
      padding: 5px 30px;
      text-align: right;
      background-color: @theme-background-color;
      font-size: @smallest-font-size;
    }
  }
</style>
