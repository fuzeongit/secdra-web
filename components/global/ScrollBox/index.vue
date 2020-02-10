<template>
  <div class="scroll-box">
    <div ref="scrollBox">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {}
</script>
<style type="text/less" lang="less" scoped>
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

.scroll-box {
  > div {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
