<template>
  <transition name="fade" enter-active-class="fadeInRight duration" leave-active-class="fadeOut duration">
    <div class="card">

    </div>
  </transition>

</template>

<script>
    export default {
      data(){
        return {
          title:"",
          Message:""
        }
      }
    }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";

  .card {
    @widht: 300px;
    width: @widht;
    position: fixed;
    z-index: @mask-index - 1;
    display: inline-block;
    top: 20px;
    left: 50%;
    margin: 0 auto 0 -(@widht / 2);
    box-shadow: 0 0 4px rgba(202, 202, 202, 0.55);
    .message{
      font-size: @default-font-size;
    }
  }
</style>
