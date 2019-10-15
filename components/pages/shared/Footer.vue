<template>
  <footer v-show="show">
    <nav>
      <ul>
        <li>
          <nuxt-link :to="`/`" class="primary-hover">Secdra</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="`/about`" class="primary-hover">关于Secdra</nuxt-link>
        </li>
        <li>
          <nuxt-link :to="`/contact`" class="primary-hover">联系作者</nuxt-link>
        </li>
        <li>
          <a
            href="https://github.com/JunJieFu"
            target="_blank"
            class="primary-hover"
            rel="nofollow"
            >Github</a
          >
        </li>
        <li>
          <nuxt-link :to="`/agreement`" class="primary-hover">
            用户协议
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="`/feedback`" class="primary-hover">反馈</nuxt-link>
        </li>
      </ul>
      <p>
        <span> © 2018-2019</span>
        <a
          href="http://beian.miit.gov.cn/"
          target="_blank"
          rel="nofollow"
          class="primary-hover"
          >粤ICP备18144953号-1
        </a>
      </p>
    </nav>
  </footer>
</template>

<script>
import { mapState } from "vuex"
import { hideFooterMenuConstant } from "../../../assets/script/constant"
export default {
  componentName: "Footer",
  computed: {
    ...mapState("menu", { activeName: "name" }),
    show() {
      return !hideFooterMenuConstant().includes(this.activeName)
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";
footer {
  background: @theme-footer-color;
  height: @footer-height;
  nav {
    width: @visual-width;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    color: @font-color-dark-fade;
    align-content: space-evenly;
    height: 100%;
    ul {
      li {
        display: inline-flex;
        width: 100px;
        a {
          color: @font-color-dark-fade;
        }
      }
    }
  }
}
</style>
