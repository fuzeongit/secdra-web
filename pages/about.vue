<template>
  <div class="page">
    <nuxt-link v-tooltip:100="text" to="/">45</nuxt-link>
    <Btn @click="text = Math.random()">132</Btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "haha"
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../assets/style/color";
@import "../assets/style/config";
@import "../assets/style/mixin";
</style>
