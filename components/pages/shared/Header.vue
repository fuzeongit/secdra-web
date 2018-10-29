<template>
  <header>
    <nav>
      <a href="/">
        <img src="../../../assets/image/logo/logo.svg" height="30px" style="vertical-align: -5px;">
      </a>
      <a href="/">测试</a>
      <template>
        <input type="text" title="search" class="input-blue is-plain">
        <i class="fa fa-search"></i>
      </template>
    </nav>
  </header>
</template>

<script>
  export default {}
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";

  header {
    height: @herder-height;
    font-size: @big-font-size;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0 0 4px rgba(202, 202, 202, 0.55);
    border-bottom: 1px solid #e2e2e2;
    background-color: @white;
    nav {
      width: @visual-width;
      margin: 0 auto;
      a {
        display: inline-block;
        line-height: @herder-height;
        color: @theme-color;
        margin-left: 20px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
</style>
