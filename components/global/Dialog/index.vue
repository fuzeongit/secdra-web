<template>
  <transition name="fade" enter-active-class="fadeIn mask-duration" leave-active-class="fadeOut mask-duration">
    <div class="mask" v-show="visible">
      <transition name="fade" enter-active-class="fadeInUp duration" leave-active-class="fadeOutDown duration">
        <div class="card" v-show="visible" :style="{marginTop: `-${offset}vh`}">
          <div class="flex-box">
            <h3 class="title">
              {{title}}
            </h3>
            <div>
              <Btn flat icon small @click.stop="close">
                <i class="icon s-close"></i>
              </Btn>
            </div>
          </div>
          <div class="dialog-body">
            <slot></slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  export default {
    componentName: "Dialog",
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      title: {
        type: String | Number,
        default: ""
      },
      //偏移量，用vh为单位
      offset: {
        type: Number,
        default: 0
      }
    },
    model: {
      prop: 'isShow',
      event: 'change'
    },
    watch: {
      isShow(newVal) {
        this.visible = newVal
      },
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$emit("change", false);
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
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .card {
    margin: 0 auto;
    vertical-align: middle;
    display: inline-block;
    padding: 15px;
    .title {
      .ellipsis();
      text-align: left;
      line-height: 35px;
      width: 100%;
    }
    .dialog-body {
      text-align: left;
    }
  }
</style>
