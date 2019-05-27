<template>
  <transition name="fade" enter-active-class="fadeInRight duration" leave-active-class="fadeOutRight duration">
    <div class="card" :style="{top:`${verticalOffset}px`}" v-show="visible">
      <div class="flex-box">
        <div class="title">
          {{title}}
        </div>
        <div>
          <a class="icon s-close" @click="close"></a>
        </div>
      </div>
      <div class="message">
        {{message}}
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    componentName: "Notification",
    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.firstElementChild.addEventListener('transitionend', this.destroyElement);
          this.$el.firstElementChild.addEventListener('animationend', this.destroyElement);

        }
      }
    },
    data() {
      return {
        title: "提示",
        Message: "",
        verticalOffset: 0,
        closeTimeout: null,
        waitTime: 5000,
        visible: false,
        closed: false,
        callback: () => {
        }
      }
    },
    mounted() {
      if (this.waitTime) {
        window.setTimeout(() => {
          this.close()
        }, this.waitTime)
      }
    },
    methods: {
      destroyElement() {
        this.$el.firstElementChild.removeEventListener('transitionend', this.destroyElement);
        this.$el.firstElementChild.removeEventListener('animationend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },
      close() {
        this.closed = true;
        window.clearTimeout(this.closeTimeout);
        this.callback && this.callback()
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin.less";

  .card {
    @size: 300px;
    width: @size;
    position: fixed;
    display: inline-block;
    right: 15px;
    z-index: @mask-index + 1;
    margin: 0 auto 0 -(@size / 2);
    transition: all @default-animate-time;
    padding: 15px;
    .title {
      .ellipsis();
      .left();
      width: 100%;
    }
    .message {
      margin-top: 8px;
      font-size: @small-font-size;
    }
  }
</style>
