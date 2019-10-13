<template>
  <div class="carousel" :style="{ height }">
    <slot></slot>
    <Btn @click="next">n</Btn>
  </div>
</template>

<script>
export default {
  componentName: "Carousel",
  model: {
    prop: "currIndex",
    event: "change"
  },
  props: {
    currIndex: {
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
      default: "right"
    },
    automatic: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      items: [],
      automaticTimeout: null
    }
  },
  computed: {
    count() {
      return this.items.length
    }
  },
  watch: {
    currIndex(newVal) {
      console.log(newVal)
      this.init()
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
    },
    init() {
      this.updateItems()
      const nextNumber = Math.ceil(this.count / 2)
      for (let i = 0; i < nextNumber; i++) {
        if (this.currIndex + i - this.count >= 0) {
          this.items[this.currIndex + i - this.count].update(i)
        } else {
          this.items[this.currIndex + i].update(i)
        }
      }
      for (let i = 1; i <= this.count - nextNumber; i++) {
        if (this.currIndex - i < 0) {
          this.items[this.count + this.currIndex - i].update(-i)
        } else {
          this.items[this.currIndex - i].update(-i)
        }
      }
    },
    next() {
      if (this.currIndex + 1 >= this.count) {
        this.$emit("change", 0)
        return
      }
      this.$emit("change", this.currIndex + 1)
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import "../../../assets/style/color";
@import "../../../assets/style/config";
.carousel {
  width: 10%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
