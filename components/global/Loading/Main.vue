<template>
  <div class="loading-mack flex-box" :class="{fixed}">
    <img src="../../../assets/image/svg/loading.svg">
  </div>
</template>

<script>
  export default {
    componentName: "Loading",
    data(){
      return {
        fixed:false
      }
    },
    methods:{
      close(){
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      }
    }
  }
</script>


<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin.less";

  .loading-mack {
    position: absolute;
    z-index: @mask-index;
    background-color: rgba(255, 255, 255, .9);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: opacity .3s;
  }
  .fixed{
    position: fixed;
  }
</style>
