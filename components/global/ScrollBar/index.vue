<template>
  <div class="scroll-bar-box" @click="scrollTo" @mouseenter="showScrollBar"
       :style="{transform: `translateY(${scrollTop}px)`}" v-if="height<100"
       @mouseleave="hideScrollBar">
    <transition
      name="fade" enter-active-class="fadeIn duration" leave-active-class="fadeOut duration">
      <div class="scroll-bar" :class="{active:scrollBarActive}" v-show="scrollBarStatus||scrollBarActive"
           :style="{height:height+`%`,transform: `translateY(${coordinate}%)`}"
           @mousedown.stop="scrollStart" @click.stop="_=>{}"
      ></div>
    </transition>
  </div>
</template>

<script>
  import windowMixin from "../../../assets/script/mixin/windowMixin"
  import {off, on} from "../../../assets/script/util/domUtil";

  export default {
    mixins: [windowMixin],
    data() {
      return {
        scrollElement: null,
        scrollHeight: 0,
        clientHeight: 0,
        startY: 0,
        startScrollTop: 0,
        mutationObserverFrameTick: false,
        scrollIngFrameTick: false,
        mutationObserver: null,
        scrollBarStatusTimeout: null,
        scrollBarStatus: false,
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
        if (!this.mutationObserverFrameTick) {
          requestAnimationFrame(() => {
            this.getHeight();
            this.mutationObserverFrameTick = false;
          });
          this.mutationObserverFrameTick = true;
        }
      });
      this.mutationObserver.observe(document.documentElement, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      });
      on(document, "mouseup", this.scrollEnd);
      if(this.scrollElement){
        on(this.scrollElement,"mouseenter",()=>{
          this.scrollBarStatus = true;
        });
        on(this.scrollElement,"mouseleave",()=>{
          this.scrollBarStatus = false;
        })
      }
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
            let el = this.scrollElement || document.documentElement;
            el.scrollTo(0, ((event.clientY - this.startY) / this.clientHeight * this.scrollHeight) + this.startScrollTop);
            this.scrollIngFrameTick = false;
          });
          this.scrollIngFrameTick = true;
        }
      },
      getHeight() {
        let el = this.scrollElement || document.documentElement;
        this.scrollHeight = el ? el.scrollHeight : 0;
        this.clientHeight = el ? el.clientHeight : 0;
      },
      scrollTo(event) {
        let el = this.scrollElement || document.documentElement;
        el.scrollTo({
          top: event.offsetY / this.clientHeight * this.scrollHeight / this.scrollTop > 1 ? this.scrollTop + this.clientHeight : this.scrollTop - this.clientHeight,
          behavior: "smooth"
        })
      },
      showScrollBar() {
        if (this.scrollElement) return;
        this.scrollBarStatus = true;
      },
      hideScrollBar() {
        if (this.scrollElement) return;
        this.scrollBarStatus = false
      }
    }
  }
</script>
<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .scroll-bar-box {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    /*bottom: 0;*/
    width: 6px;
    z-index: @mask-index - 2;
    .scroll-bar {
      user-select: none;
      touch-action: none;
      position: relative;
      border-radius: 10px;
      background-color: @font-color-dark-disabled;
      cursor: pointer;
      display: block;
      transition: background-color @default-animate-time;
      &.active, &:hover {
        background-color: @font-color-dark-fade
      }
    }
  }
</style>
