<template>
  <transition
    name="fade"
    enter-active-class="fadeIn short-duration"
    leave-active-class="fadeOut short-duration"
  >
    <div v-show="showPopper" ref="popper" class="card popper" role="tooltip">
      {{ label }}
    </div>
  </transition>
</template>
<script>
import popperMixin from "../../../assets/script/mixin/popperMixin"

export default {
  componentName: "Tooltip",
  mixins: [popperMixin],
  data() {
    return {
      label: ""
    }
  }
}
</script>
