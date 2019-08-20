<template>
 <span class="tag" :class="classObject">
    {{content}}
     <Btn flat icon :color="color" @click="close" class="close">
        <i class="icon ali-icon-close"></i>
     </Btn>
  </span>
</template>

<script>
  export default {
    componentName: "Tag",
    props: {
      content: {
        type: String,
      },
      value: {},
      color: {
        type: String,
        default: 'default'
      },
      small: {
        type: Boolean,
        default: false
      },
      big: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      classObject() {
        let classObject = {};
        classObject[this.color + "-color"] = true;
        classObject["small"] = this.small;
        classObject["big"] = this.big;
        return classObject
      }
    },
    methods: {
      close() {
        this.$emit("close", {content: this.content, value: this.value});
      },
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .tag {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: @smallest-border-radius;
    line-height: @input-line-height - @input-border-size - @input-border-size;
    border: @input-border-size solid @font-color-dark-line;
    padding: 0 1em;
    font-size: @small-font-size;

    .close {
      margin-left: .5em;
      height: @tag-close-size;
      width: @tag-close-size;
      line-height: @tag-close-size;
      i {
        font-size: @small-font-size;
      }
    }

    .color(@color,@font-color) {
      background-color: white;
      border-color: @color;
      color: @font-color;
    }

    &.big {
      line-height: @big-input-line-height - @input-border-size - @input-border-size;
      font-size: @default-font-size;
      padding: 0 1em;

      &.close {
        margin-left: .7em;
        height: @big-tag-close-size;
        width: @big-tag-close-size;
        line-height: @big-tag-close-size;
        i {
          font-size: @default-font-size;
        }
      }
    }
    &.small {
      line-height: @small-input-line-height - @input-border-size - @input-border-size;
      font-size: @smallest-font-size;
      padding: 0 .5em;
      &.close {
        margin-left: .3em;
        height: @small-tag-close-size;
        width: @small-tag-close-size;
        line-height: @small-tag-close-size;
        i {
          font-size: @smallest-font-size;
        }
      }
    }

    &.default-color {
      .color(@font-color-dark-line, @font-color-dark);
    }
    &.primary-color {
      .color(@theme-color, @theme-color)
    }
  }
</style>
