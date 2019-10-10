<template>
  <div class="page">
    <div class="content card">
      <h1 class="center">联系作者</h1>
      <p>
        Z~Z~Z~
      </p>
      <p>
        Z~Z~Z~
      </p>
      <p>
        Z~Z~Z~
      </p>
      <p>您拨打的用户暂时无人接听，<s>请稍后再拨</s></p>
      <p>你可以选择发送邮件至：245142637@qq.com，每天都会看哦！</p>
    </div>
  </div>
</template>

<script>
export default {}
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
    s {
      text-decoration: line-through;
    }
  }
}
</style>
