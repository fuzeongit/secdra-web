<template>
  <div
    class="carousel"
    :style="{ height }"
    :class="{ vertical }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <slot></slot>
    <nav v-if="indicator">
      <button
        v-for="index in count"
        :key="index - 1"
        class="indicator"
        :class="{ active: normalizedIndex === index - 1 }"
        @click.stop="change(index - 1 - normalizedIndex)"
      ></button>
    </nav>
    <div v-if="arrow" class="tool">
      <transition
        name="fade"
        enter-active-class="fadeInDown duration"
        leave-active-class="fadeOutUp duration"
      >
        <Btn
          v-show="hover && vertical && hasPrev"
          icon
          class="up"
          @click.stop="change(-1)"
          ><i class="icon ali-icon-up"></i
        ></Btn>
      </transition>
      <transition
        name="fade"
        enter-active-class="fadeInRight duration"
        leave-active-class="fadeOutRight duration"
      >
        <Btn
          v-show="hover && !vertical && hasNext"
          icon
          class="right"
          @click.stop="change(1)"
          ><i class="icon ali-icon-right"></i
        ></Btn>
      </transition>
      <transition
        name="fade"
        enter-active-class="fadeInUp duration"
        leave-active-class="fadeOutDown duration"
      >
        <Btn
          v-show="hover && vertical && hasNext"
          icon
          class="down"
          @click.stop="change(1)"
          ><i class="icon ali-icon-down"></i
        ></Btn>
      </transition>
      <transition
        name="fade"
        enter-active-class="fadeInLeft duration"
        leave-active-class="fadeOutLeft duration"
      >
        <Btn
          v-show="hover && !vertical && hasPrev"
          icon
          class="left"
          @click.stop="change(-1)"
          ><i class="icon ali-icon-back"></i
        ></Btn>
      </transition>
    </div>
  </div>
</template>

<script>
import { direction } from "./constant"
const DIRECTION = direction()
export default {
  componentName: "Carousel",
  model: {
    prop: "initIndex",
    event: "change"
  },
  props: {
    initIndex: {
      type: Number,
      default: 0
    },
    height: {
      type: String,
      default: "0",
      required: true
    },
    loop: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: "right",
      validator: (value) => Object.keys(DIRECTION).includes(value)
    },
    automaticTime: {
      type: Number,
      default: 5000
    },
    indicator: {
      type: Boolean,
      default: true
    },
    arrow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      items: [],
      automaticTimeout: null,
      normalizedIndex: this.initIndex,
      normalizedDirection: this.direction,
      hover: false
    }
  },
  computed: {
    count() {
      return this.items.length
    },
    vertical() {
      return this.direction === "down" || this.direction === "up"
    },
    hasPrev() {
      return this.loop || this.normalizedIndex > 0
    },
    hasNext() {
      return this.loop || this.normalizedIndex < this.count - 1
    }
  },
  watch: {
    initIndex(newVal) {
      this.change(newVal - this.normalizedIndex)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    updateItems() {
      this.items = this.$children.filter(
        (item) => item.$options.componentName === "CarouselItem"
      )
      for (let i = 0; i < this.count; i++) {
        this.items[i].init(i, this.direction)
      }
    },
    init() {
      this.updateItems()
      this.automatic()
    },
    automatic() {
      if (this.automaticTime) {
        this.automaticTimeout && clearTimeout(this.automaticTimeout)
        this.automaticTimeout = setTimeout(() => {
          this.change(1)
          this.automatic()
        }, this.automaticTime)
      }
    },
    change(i) {
      if (i === 0) {
        return
      }
      if (i > 0) {
        this.normalizedDirection = this.direction
      } else {
        this.normalizedDirection = DIRECTION[this.direction].opposite
      }
      if (this.normalizedIndex + i >= this.count) {
        if (!this.loop) return
        this.normalizedIndex = 0
        this.$emit("change", this.normalizedIndex)
      } else if (this.normalizedIndex + i < 0) {
        if (!this.loop) return
        this.normalizedIndex = this.count - 1
        this.$emit("change", this.normalizedIndex)
      } else {
        this.normalizedIndex = this.normalizedIndex + i
        this.$emit("change", this.normalizedIndex)
      }
      this.automatic()
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import "../../../assets/style/color";
@import "../../../assets/style/config";
.carousel {
  @nav-size: 10px;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: @font-color-dark-line;
  nav {
    @nav-size: 6px;
    position: absolute;
    top: auto;
    bottom: 10px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    z-index: 2;
    display: inline;
    .indicator {
      cursor: pointer;
      width: @nav-size;
      height: @nav-size;
      background-color: @font-color-light-fade;
      border-radius: @nav-size;
      margin: 0 3px;
      transform: @short-animate-time;
      &.active {
        cursor: default;
        width: @nav-size * 3;
        height: @nav-size;
      }
    }
  }
  .tool {
    @margin: 10px;
    @center: calc(50% - (@input-line-height / 2));
    .btn {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.3);
      &.up {
        left: @center;
        top: @margin;
      }
      &.down {
        left: @center;
        bottom: @margin;
      }
      &.left {
        top: @center;
        left: @margin;
      }
      &.right {
        top: @center;
        right: @margin;
      }
      i {
        color: @font-color-light-fade;
      }
    }
  }
  &.vertical {
    nav {
      top: 50%;
      bottom: auto;
      left: auto;
      right: 10px;
      transform: translateY(-50%);
      .indicator {
        display: block;
        margin: 4px 0;
        &.active {
          cursor: default;
          width: @nav-size;
          height: @nav-size * 3;
        }
      }
    }
  }
}
</style>
