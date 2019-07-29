<template>
  <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
    <Btn icon big shadow v-show="scrollTop>150" class="go-top" @click="goTop">
      <i class="icon s-up"></i>
    </Btn>
  </transition>
</template>

<script>
  import windowMixin from "../../../assets/script/mixin/windowMixin"

  export default {
    componentName: "GoTop",
    mixins: [windowMixin],
    methods: {
      goTop() {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    }
  }
</script>

<style scoped>

</style>
