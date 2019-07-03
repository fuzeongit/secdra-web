<template>
  <label class="switch" :class="{active:value}">
    <input type="checkbox" title="switch" v-model="value">
  </label>
</template>

<script>
  export default {
    componentName: "Switch",
    props: {
      input: {
        type: Boolean,
        default: true
      }
    },
    model: {
      prop: "input",
      event: "input"
    },
    watch: {
      input(newVal) {
        this.value = newVal
      },
      value: function (newVal) {
        this.$emit("input", newVal)
      },
    },
    data() {
      return {
        value: this.input
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .switch {
    @size:20px;
    @distance:2px;
    display: inline-flex;
    align-items: center;
    position: relative;
    vertical-align: text-bottom;
    line-height: @size;
    height: @size;
    width: @size * 2;
    border-radius: @size;
    background-color: darken(@gray, -30%);
    transition: border-color .3s, background-color .3s;
    &:before{
      content: " ";
      position: absolute;
      top: @distance;
      left: @distance;
      right: auto;
      bottom: auto;
      width: @size - @distance * 2;
      height:  @size - @distance * 2;
      background-color: white;
      border-radius: 50%;
      transition: all .3s;
      margin-left:0;
    }
    &.active{
      background-color: @theme-color;
      &:before {
        margin-left: @size;
      }
    }
    input {
      display: none;
    }
  }
</style>
