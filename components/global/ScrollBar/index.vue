<template>
  <div class="scroll-bar-box">
    <transition
      name="fade" enter-active-class="fadeIn short-duration" leave-active-class="fadeOut short-duration">
      <div class="scroll-bar" v-show="init"
           :style="{height:(clientHeight/scrollHeight  * 100) + '%',transform: `translateY(${translate}%)`}"
           @mousedown.stop="start"
      ></div>
    </transition>
  </div>
</template>

<script>
  import windowMixin from "../../../assets/script/mixin/windowMixin"
  import {on} from "../../../assets/script/util/domUtil";

  export default {
    mixins: [windowMixin],
    data() {
      return {
        init: false,
        scrollHeight: 0,
        clientHeight: 0,
        flag: false,
        startY: 0,
        startScrollTop: 0,
        _mutationObserverFrameTick: false,
        _mousemoveFrameTick: false,
        _mutationObserver: null
      }
    },
    computed: {
      translate() {
        return (this.scrollTop / this.scrollHeight * this.scrollHeight / this.clientHeight * 100)
      }
    },
    mounted() {
      this._mutationObserver = new MutationObserver((mutations, _observer) => {
        if (!this._mutationObserverFrameTick) {
          requestAnimationFrame(() => {
            this.scrollHeight = document.documentElement.scrollHeight;
            this.clientHeight = document.documentElement.clientHeight;
            this.init = true;
            this._mutationObserverFrameTick = false;
          });
          this._mutationObserverFrameTick = true;
        }
      });
      this._mutationObserver.observe(document.documentElement, {childList: true, subtree: true});

      on(document, "mouseup", () => {
        this.flag = false
      });
      on(document, "mousemove", e => {
        if (this.flag) {
          if (!this._mousemoveFrameTick) {
            requestAnimationFrame(() => {
              window.scrollTo(0, ((e.clientY - this.startY) / this.scrollHeight * this.clientHeight) + this.startScrollTop);
              this._mousemoveFrameTick = false;
            });
            this._mousemoveFrameTick = true;
          }
        }
      })
    },
    beforeDestroy() {
      this._mutationObserver.disconnect()
    },
    methods: {
      start(e) {
        this.startY = e.clientY;
        this.startScrollTop = this.scrollTop;
        console.log(this.scrollTop);
        this.flag = true
      }
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
      background-color: #bbb;
      cursor: pointer;
    }
  }
</style>
