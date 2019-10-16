<template>
  <component
    :is="tag"
    :style="{ visibility: ready ? '' : 'hidden' }"
    :class="{ duration: operation, [animation]: operation }"
  >
    <slot></slot>
  </component>
</template>

<script>
export default {
  componentName: "Delay",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    animationDelay: {
      type: Number,
      default: 0
    },
    duration: {
      type: String,
      default: "duration",
      validator: (value) =>
        ["duration", "short-duration", "shortest-duration"].includes(value)
    },
    animation: {
      type: String,
      default: "fadeInUp"
    }
  },
  data() {
    return {
      ready: false,
      operation: true
    }
  },
  mounted() {
    const computedStyle = window.getComputedStyle(this.$el)
    const animationDelay = computedStyle.animationDelay
    const animationDuration = computedStyle.animationDuration
    this.$el.style.animationDelay = `${this.animationDelay}s`
    // 延迟和动画时间结束后移除相应的动画
    setTimeout(() => {
      this.$el.style.animationDelay = animationDelay
      this.operation = false
    }, (this.animationDelay + animationDuration.replace("s", "") * 1) * 1000)
    this.ready = true
  }
}
</script>

<style scoped></style>
