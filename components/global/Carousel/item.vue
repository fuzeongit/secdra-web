<template>
  <transition
    name="slide"
    :enter-active-class="inClass"
    :leave-active-class="outClass"
  >
    <div
      v-show="ready && $parent && $parent.normalizedIndex === index"
      class="carousel-item"
    >
      <slot>{{ index }}</slot>
    </div>
  </transition>
</template>

<script>
import { direction } from "./constant"
const DIRECTION = direction()
export default {
  componentName: "CarouselItem",
  data() {
    return {
      index: -1,
      ready: false
    }
  },
  computed: {
    inClass() {
      if (this.$parent) {
        return (
          DIRECTION[this.$parent.normalizedDirection].in +
          " " +
          "short-duration"
        )
      }
      return " "
    },
    outClass() {
      if (this.$parent) {
        return (
          DIRECTION[this.$parent.normalizedDirection].out +
          " " +
          "short-duration"
        )
      }
      return " "
    }
  },
  mounted() {
    this.ready = true
  },
  created() {
    this.$parent && this.$parent.updateItems()
  },
  destroyed() {
    this.$parent && this.$parent.updateItems()
  },
  methods: {
    init(index) {
      this.index = index
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import "../../../assets/style/color";
@import "../../../assets/style/config";
.carousel-item {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
</style>
