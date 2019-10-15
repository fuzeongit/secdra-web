<template>
  <div class="page">
    <div class="content card">
      <h1 class="center">用户协议</h1>
      <p style="text-align: center">富强、民主、文明、和谐，</p>
      <p style="text-align: center">自由、平等、公正、法治，</p>
      <p style="text-align: center">爱国、敬业、诚信、友善。</p>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return { title: "关于本站 - Secdra" }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import "../assets/style/color";
@import "../assets/style/config";
@import "../assets/style/mixin";
.page {
  padding: @page-gap 0;
}
.content {
  width: @visual-width;
  margin: 0 auto;
  padding: 20px 30px;
  h1 {
    line-height: 70px;
    font-size: @big-font-size;
    color: @font-color-dark-fade;
  }
  p {
    line-height: 36px;
    font-size: @default-font-size;
    color: @font-color-dark-fade;
    text-indent: 2em;
    margin-bottom: 1em;
  }
}
</style>
