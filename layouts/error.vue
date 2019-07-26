<template>
  <div class="page flex-box" style="padding: 30px;">
    <img src="../assets/image/error/404.jpg" v-if="error.statusCode===404">
    <div  v-else>
        {{error}}
    </div>
  </div>
</template>

<script>
  export default {
    props: ['error'],
    name: "error",
    data(){
      return {
        c:true,
        d:new Date()
      }
    },
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
