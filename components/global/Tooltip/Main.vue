<template>
  <transition
    name="fade"
    enter-active-class="fadeIn short-duration"
    leave-active-class="fadeOut short-duration"
    @after-leave="destroyElement"
  >
    <div v-show="showPopper" ref="popper" class="card tooltip" role="tooltip">
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
  },
  methods: {
    destroyElement() {
      this.$destroy(true)
    }
  }
}
</script>
