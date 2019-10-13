<template>
  <div
    class="carousel-item"
    :style="{
      transform: `translateX(${index * 100}%)`,
      transition: index === 0 ? '.5s' : '0s'
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName: "CarouselItem",
  data() {
    return {
      index: 0
    }
  },
  methods: {
    update(index) {
      this.index = index
    },
    created() {
      this.$parent && this.$parent.updateItems()
    },

    destroyed() {
      this.$parent && this.$parent.updateItems()
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
