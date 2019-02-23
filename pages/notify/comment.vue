<template>
    <div>comment</div>
</template>

<script>
    export default {
      beforeCreate() {
        this.$parent.type = "comment"
      }
    }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";
</style>
