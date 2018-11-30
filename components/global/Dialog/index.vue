<template>
  <transition name="fade" enter-active-class="fadeIn mask-duration" leave-active-class="fadeOut mask-duration">
    <div class="mask" v-show="visible">
      <transition name="fade" enter-active-class="fadeInUp duration" leave-active-class="fadeOutDown duration">
        <div class="card" v-show="visible">
          <div class="flex-box">
            <div class="title">
              {{title}}
            </div>
            <div>
              <a class="icon s-close" @click="close"></a>
            </div>
          </div>
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      title: {
        type: String|Number,
        default: ""
      }
    },
    model: {
      prop: 'isShow',
      event: 'change'
    },
    watch: {
      isShow(newVal){
        this.visible = newVal
      },
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$emit("change",false);
          this.$el.firstElementChild.addEventListener('transitionend', this.destroyElement);
          this.$el.firstElementChild.addEventListener('animationend', this.destroyElement);
        }
      }
    },
    data() {
      return {
        visible: false,
        closed: false,
      }
    },
    methods: {
      destroyElement() {
        this.$el.firstElementChild.removeEventListener('transitionend', this.destroyElement);
        this.$el.firstElementChild.removeEventListener('animationend', this.destroyElement);
        this.closed = false;
      },
      close() {
        this.closed = true;
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin.less";

  .card {
    margin: 0 auto;
    vertical-align: middle;
    display: inline-block;
    padding: 15px;
    .title {
      .ellipsis();
      .left();
      width: 100%;
    }
  }
</style>
