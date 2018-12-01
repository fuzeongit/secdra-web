<template>
  <div>
    <section>
      <Header></Header>
        <transition name="fade" enter-active-class="fadeIn duration" leave-active-class="fadeOut duration">
          <nuxt />
        </transition>
    </section>
  </div>
</template>
<script>
  import Header from "../components/pages/shared/Header"

  export default {
    middleware: 'auth',
    components: {
      Header
    }
  }
</script>
<style type="text/less" lang="less">
  /*@import "https://unpkg.com/element-ui@2.4.9/lib/theme-chalk/index.css";*/
  @import "//at.alicdn.com/t/font_896802_89ms53u5qk8.css";
</style>
