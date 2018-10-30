<template>
  <div class="page flex-box">
    <img src="../assets/image/error/404.jpg" v-if="error.statusCode===404">
  </div>
</template>

<script>
  export default {
    props: ['error'],
    name: "error"
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";

  .page {
    background-color: @white;
  }
</style>
