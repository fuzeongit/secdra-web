<template>
  <div class="page flex-box">
    <img src="../assets/image/error/404.jpg" v-if="error.statusCode===404">
    <div  v-else>
        {{error}}
    </div>
  </div>
</template>

<script>
  export default {
    props: ['error'],
    // layout: 'empty',
    name: "error",
    mounted(){
      console.error(this.error)
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";

  .page {
    background-color: @white;
  }
</style>
