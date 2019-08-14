<template>
  <div class="scroll-bar-box" @click="scrollTo" @mouseenter="showScrollBar = true"
       @mouseleave="showScrollBar = false">
    <transition
      name="fade" enter-active-class="fadeIn short-duration" leave-active-class="fadeOut short-duration">
      <div class="scroll-bar" :class="{active:scrollBarActive}" v-show="showScrollBar||scrollBarActive"
           :style="{height:height+`%`,transform: `translateY(${coordinate}%)`}"
           @mousedown.stop="scrollStart" @click.stop="_=>{}"
      ></div>
    </transition>
  </div>
</template>

<script>
  import windowMixin from "../../../assets/script/mixin/windowMixin"
  import {off, on, scrollToBySmooth} from "../../../assets/script/util/domUtil";

  export default {
    mixins: [windowMixin],
    data() {
      return {
        scrollHeight: 0,
        clientHeight: 0,
        startY: 0,
        startScrollTop: 0,
        _mutationObserverFrameTick: false,
        scrollIngFrameTick: false,
        mutationObserver: null,
        showScrollBar: false,
        scrollBarActive: false
      }
    },
    computed: {
      height() {
        return this.clientHeight / this.scrollHeight * 100
      },
      coordinate() {
        return (this.scrollTop / this.scrollHeight * this.scrollHeight / this.clientHeight * 100)
      }
    },
    mounted() {
      this.getHeight();
      this.mutationObserver = new MutationObserver((mutations, _observer) => {
        if (!this._mutationObserverFrameTick) {
          requestAnimationFrame(() => {
            this.getHeight();
            this._mutationObserverFrameTick = false;
          });
          this._mutationObserverFrameTick = true;
        }
      });
      this.mutationObserver.observe(document.documentElement, {childList: true, subtree: true});
      on(document, "mouseup", this.scrollEnd);
    },
    beforeDestroy() {
      this.mutationObserver.disconnect();
      off(document, "mouseup", this.scrollEnd);
      off(document, "mousemove", this.scrollIng)
    },
    methods: {
      scrollStart(event) {
        this.startY = event.clientY;
        this.startScrollTop = this.scrollTop;
        this.scrollBarActive = true;
        on(document, "mousemove", this.scrollIng)
      },
      scrollEnd(event) {
        off(document, "mousemove", this.scrollIng);
        //必须等待一帧后再重置
        requestAnimationFrame(() => {
          this.startY = 0;
          this.startScrollTop = 0;
          this.scrollBarActive = false;
        });
      },
      scrollIng(event) {
        if (!this.scrollIngFrameTick) {
          requestAnimationFrame(() => {
            window.scrollTo(0, ((event.clientY - this.startY) / this.clientHeight * this.scrollHeight) + this.startScrollTop);
            this.scrollIngFrameTick = false;
          });
          this.scrollIngFrameTick = true;
        }
      },
      getHeight() {
        this.scrollHeight = document.documentElement.scrollHeight;
        this.clientHeight = document.documentElement.clientHeight;
      },
      scrollTo(event) {
        scrollToBySmooth(window, event.clientY / this.clientHeight * this.scrollHeight / this.scrollTop > 1 ? this.scrollTop + this.clientHeight : this.scrollTop - this.clientHeight)
      },
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .scroll-bar-box {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 10px;
    z-index: @mask-index - 2;
    .scroll-bar {
      user-select: none;
      touch-action: none;
      position: relative;
      border-radius: 10px;
      background-color: @font-color-dark-disabled;
      cursor: pointer;
      display: block;
      transition: background-color 0.1s;
      &.active, &:hover {
        background-color: @font-color-dark-fade
      }
    }
  }
</style>
