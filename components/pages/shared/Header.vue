<template>
  <header class="animated duration" :class="{fadeInDown:isShow&&hid,fadeOutUp:!isShow}">
    <nav>
      <nuxt-link to="/" :class="{active:activeName===`home`}">
        <!--<img src="../../../assets/image/svg/logo.svg" height="30px">-->
        主站
      </nuxt-link>
      <nuxt-link to="/find" :class="{active:activeName===`find`}">
        发现
      </nuxt-link>
      <nuxt-link to="/new" :class="{active:activeName===`new`}">
        最新
      </nuxt-link>
      <nuxt-link :to="`/collection/${user.id||''}`" :class="{active:activeName===`collection`}">
        收藏
      </nuxt-link>
      <nuxt-link :to="`/works/${user.id||''}`" :class="{active:activeName===`works`}">
        作品
      </nuxt-link>
      <template>
        <div class="right-box">
          <!--<input type="search" title="search" class="input is-plain" @search="search" v-model="tag"-->
          <!--placeholder="输入标签搜索">-->
          <!--<a @click="search">-->
          <!--<i class="s-chaxun icon"></i>-->
          <!--</a>-->
          <nuxt-link to="/message/comment" class="link" :class="{active:activeName===`message`}"
                     style="position: relative">
            <span class="message-count" v-if="messageCount">{{messageCount|toMore}}</span>
            <i class="icon s-xinxizhongxin"></i>
          </nuxt-link>
          <div class="head-img-box">
            <nuxt-link :to="`/user/${user.id||''}`">
              <img :src="$img.head(user.head,'small50')" width="30" height="30" v-popover:popover
                   :onerror="`this.src='${require('../../../assets/image/default/default-head.jpg')}'`"
                   style="border-radius: 50%;">
            </nuxt-link>
            <Popper ref="popover"
                    trigger="hover"
                    :visibleArrow="false">
              <div class="head-popover">
                <div class="bk cover" :style="{backgroundImage: `url(${$img.back(user.background,`backCard`)})`}"></div>
                <!--<nuxt-link :to="`/user/${user.id||''}`">-->
                <!--<img :src="$img.head(user.head)" width="100" height="100"-->
                <!--:onerror="`this.src='${require('../../../assets/image/default/default-head.jpg')}'`"-->
                <!--style="border-radius: 50%;margin: 0 auto;display: block;transform: translateY(-50px)">-->
                <!--</nuxt-link>-->
                <p class="name">{{user.name}}</p>
                <p class="introduction" :title="user.introduction">{{user.introduction}}</p>
                <ul class="head-menu row">
                  <!--<li>-->
                  <!--<nuxt-link to="/message/comment" :class="{active:activeName===`message`}">-->
                  <!--<i class="icon s-xinxizhongxin"></i>-->
                  <!--我的消息-->
                  <!--</nuxt-link>-->
                  <!--</li>-->
                  <li>
                    <nuxt-link :to="`/follower/${user.id||''}`" :class="{active:activeName===`follower`}">
                      <i class="icon s-guanzhu1"></i>
                      我的粉丝
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link :to="`/following/${user.id||''}`" :class="{active:activeName===`following`}">
                      <i class="icon s-guanzhu1"></i>
                      关注用户
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/footprint" :class="{active:activeName===`footprint`}">
                      <i class="icon s-zuji"></i>
                      我的足迹
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/upload" :class="{active:activeName===`upload`}">
                      <i class="icon s-upload"></i>
                      我要上传
                    </nuxt-link>
                  </li>
                </ul>
                <div class="footer">
                  <a @click="logout">
                    <i class="icon s-zhuxiao"></i>
                    退出登录
                  </a>
                </div>
              </div>
            </Popper>
          </div>
        </div>
      </template>
    </nav>
  </header>
</template>

<script>
  import Cookie from 'js-cookie'
  import {mapState, mapMutations, mapActions} from "vuex"

  export default {
    componentName: "Header",
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
      ...mapState('window', ['scrollTop']),
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
    mounted() {
      this.countUnread();
      document.addEventListener('scroll', this.documentScroll);
    },
    beforeDestroy() {
      document.removeEventListener('scroll', this.documentScroll);
    },
    methods: {
      ...mapMutations("window", ["MChangesScroll"]),
      ...mapMutations("message", ["MChangeCount"]),
      ...mapActions("message", ["ACount"]),
      documentScroll(event) {
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        let scrollBottom = document.body.scrollHeight - this.scrollTop - event.target.documentElement.clientHeight;
        this.MChangesScroll({scrollTop, scrollBottom})
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
      async countUnread() {
        let result = await this.ACount();
        if (result.status !== 200) {
          return
        }
        this.MChangeCount({type: 'comment', count: result.data.COMMENT});
        this.MChangeCount({type: 'reply', count: result.data.REPLY});
        this.MChangeCount({type: 'follow', count: result.data.FOLLOW});
        this.MChangeCount({type: 'system', count: result.data.SYSTEM});
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin.less";

  header {
    height: @herder-height;
    font-size: @small-font-size;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0 0 4px rgba(202, 202, 202, 0.55);
    background-color: @white;
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
        border-bottom: (@herder-height - @herder-nav-height) solid @white;
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
          color: @white;
          background-color: @theme-color;
          padding: 0 5px;
          border-radius: @default-font-size / 2;
          position: absolute;
          top: -10px;
          right: -12px;
        }
        .link {
          font-size: @small-font-size;
          &.active, &:hover {
            color: @theme-color;
          }
        }
        .head-img-box {
          vertical-align: top;
          display: inline-block;
          position: relative;
          padding-left: 30px;
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
      .center();
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
      width: @size;
      background-color: @white;
      border-radius: @smallest-border-radius;
      text-align: center;
      user-select: none;
      li {
        width: 50%;
        float: left;
        line-height: 28px;
        a {
          color: @font-color-dark;
          display: inline-block;
          height: 100%;
          font-size: @smallest-font-size;
          &.active {
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
      padding: 0 30px;
      line-height: 28px;
      text-align: right;
      background-color: @theme-background-color;
      font-size: @smallest-font-size;
    }
  }
</style>
