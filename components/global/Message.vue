<template>
  <transition name="fade" enter-active-class="fadeInDown duration" leave-active-class="fadeOutUp duration">
    <div class="card padding-15" v-show="visible">
      <p class="message">
        {{message}}
      </p>
    </div>
  </transition>
</template>

<script>
  export default {
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
        this.closeTimeout = setTimeout(() => {
          this.close()
        }, this.waitTime)
      }
    },
    methods: {
      destroyElement() {
        this.$el.firstElementChild.removeEventListener('transitionend', this.destroyElement);
        this.$el.firstElementChild.removeEventListener('animationend', this.destroyElement);
        window.clearTimeout(this.closeTimeout);
        this.callback && this.callback();
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },
      close() {
        this.closed = true;
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../assets/style/color.less";
  @import "../../assets/style/config.less";

  .card {
    @widht: 300px;
    width: @widht;
    position: fixed;
    z-index: @mask-index - 1;
    display: inline-block;
    top: 20px;
    left: 50%;
    margin: 0 auto 0 -(@widht / 2);
    box-shadow: 0 0 4px rgba(202, 202, 202, 0.55);
    .message{
      font-size: @default-font-size;
    }
  }
</style>
