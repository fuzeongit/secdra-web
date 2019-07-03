<template>
 <span class="tag">
    {{content}}
     <a class="icon s-close" @click="close"></a>
  </span>
</template>

<script>
  export default {
    componentName: "Tag",
    props: ["content", "value"],
    methods: {
      close() {
        this.$emit("close", {content: this.content, value: this.value});
      },
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";
  @import "../../../assets/style/mixin.less";

  .tag {
    line-height: @small-input-line-height;
    border-radius: @smallest-border-radius;
    border: 1px solid @theme-color;
    color: @theme-color;
    background-color: @tag-color;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 0 .5em;
    font-size: @small-font-size;
    .icon {
      color: @theme-color;
      font-size: @small-font-size;
    }
    text-align: center;
  }
</style>
