<template>
  <div>
    <section>
      <Header></Header>
      <nuxt/>
    </section>
  </div>
</template>
<script>
  import Header from "../components/pages/shared/Header"
  export default {
    middleware: 'auth',
    components:{
      Header
    }
  }
</script>
<style type="text/less" lang="less">
  @import "https://unpkg.com/element-ui@2.4.9/lib/theme-chalk/index.css";
  @import "//at.alicdn.com/t/font_896802_xyth6ekyvk.css";
</style>
