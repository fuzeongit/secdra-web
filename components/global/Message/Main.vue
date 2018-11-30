<template>
  <transition name="fade" enter-active-class="fadeInDown duration" leave-active-class="fadeOutUp duration">
    <div class="card" v-show="visible">
      <div class="flex-box">
        <p class="message">
          {{message}}
        </p>
        <div>
          <a class="icon s-close" @click="close"></a>
        </div>
      </div>
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
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },
      close() {
        this.closed = true;
        window.clearTimeout(this.closeTimeout);
        this.callback && this.callback(this);
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
    z-index: @mask-index - 1;
    display: inline-block;
    top: 20px;
    left: 50%;
    margin: 0 auto 0 -(@size / 2);
    box-shadow: 0 0 4px rgba(202, 202, 202, 0.55);
    padding: 15px;
    .message{
      .ellipsis();
      .left();
      width: 100%;
      font-size: @default-font-size;
    }
  }
</style>
