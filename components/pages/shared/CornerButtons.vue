<template>
  <div class="corner-buttons">
    <div class="customize-buttons" :class="{active:showGoTop && scrollTop>150}">
      <slot></slot>
    </div>
    <transition name="zoom" enter-active-class="fadeInUp duration" leave-active-class="fadeOutDown duration">
      <Btn icon big shadow v-if="showGoTop" v-show="scrollTop>150" color="white" @click="goTop">
        <i class="icon ali-icon-up"></i>
      </Btn>
    </transition>
  </div>
</template>

<script>
  import windowMixin from "../../../assets/script/mixin/windowMixin"
  import {scrollToBySmooth} from "../../../assets/script/util/domUtil";

  export default {
    componentName: "CornerButtons",
    props: {
      showGoTop: {
        type: Boolean,
        default: true
      }
    },
    mixins: [windowMixin],
    methods: {
      goTop() {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .corner-buttons {
    position: fixed;
    bottom: 50px;
    right: 50px;
  }

  .customize-buttons {
    width: @big-input-line-height;
    position: absolute;
    bottom: 0;
    right: 0;
    transition: @default-animate-time;
    &.active {
      bottom: @big-input-line-height + 10px
    }
  }
</style>
