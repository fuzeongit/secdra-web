<template>
  <transition
    name="fade"
    enter-active-class="fadeIn mask-duration"
    leave-active-class="fadeOut mask-duration"
  >
    <div v-show="visible" class="mask" @click="onPersistent">
      <transition
        :enter-active-class="enterActiveClass"
        :leave-active-class="leaveActiveClass"
        @after-leave="destroyElement"
      >
        <div
          v-show="visible"
          class="card duration"
          :style="{ marginTop: `-${offset}vh` }"
          :class="{
            'dialog-persistent-animate': persistentAnimate,
            duration: persistentAnimate,
            padding
          }"
          @animationend="persistentAnimationend()"
        >
          <div v-if="title" class="flex-box">
            <h3 class="title">
              {{ title }}
            </h3>
            <div>
              <Btn flat icon small @click="close">
                <i class="icon ali-icon-close"></i>
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
import dialogMixin from "../../../assets/script/mixin/dialogMixin"
import {
  on,
  off,
  addClass,
  removeClass
} from "../../../assets/script/util/domUtil"

export default {
  componentName: "Dialog",
  mixins: [dialogMixin],
  model: {
    prop: "show",
    event: "change"
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String | Number,
      default: ""
    },
    // 偏移量，用vh为单位
    offset: {
      type: Number,
      default: 0
    },
    enterActiveClass: {
      type: String,
      default: "fadeInUp"
    },
    leaveActiveClass: {
      type: String,
      default: "fadeOutDown"
    },
    padding: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      closed: false
    }
  },
  watch: {
    show(newVal) {
      this.visible = newVal
      if (newVal) {
        this.closed = !newVal
        on(document, "keydown", this.onEsc)
        addClass(document.body, "not-scroll")
      }
    }
  },
  methods: {
    destroyElement() {
      off(document, "keydown", this.onEsc)
      removeClass(document.body, "not-scroll")
      this.closed = true
    },
    close() {
      this.closed = true
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
  &.padding {
    padding: 15px;
  }
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
