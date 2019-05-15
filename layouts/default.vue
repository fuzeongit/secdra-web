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
    middleware: ['auth','messageRedirect'],
    components: {
      Header
    }
  }
</script>
<style type="text/less" lang="less" scoped>
</style>
