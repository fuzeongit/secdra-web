<template>
  <span class="tag" :class="classObject">
    {{ content }}
    <Btn flat icon :color="color" class="close" @click="close">
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
      default: ""
    },
    value: {
      type: Object | String | Number | Array,
      default: null
    },
    color: {
      type: String,
      default: "default"
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
      const classObject = {}
      classObject[this.color + "-color"] = true
      classObject.small = this.small
      classObject.big = this.big
      return classObject
    }
  },
  methods: {
    close() {
      this.$emit("close", { content: this.content, value: this.value })
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";

.tag {
  @padding: 0.4em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: @smallest-border-radius;
  line-height: @tag-line-height;
  padding: 0 @padding;
  font-size: @small-font-size;

  .close {
    margin-left: @padding / 2;
    height: @tag-close-size;
    width: @tag-close-size;
    line-height: @tag-close-size;
    i {
      font-size: @small-font-size;
    }
  }

  .color(@color,@font-color) {
    background-color: @color;
    color: @font-color;
    i {
      color: @font-color;
    }
  }

  &.big {
    @padding: 0.5em;
    line-height: @big-tag-line-height;
    font-size: @default-font-size;
    padding: 0 @padding;

    .close {
      margin-left: @padding / 2;
      height: @big-tag-close-size;
      width: @big-tag-close-size;
      line-height: @big-tag-close-size;
      i {
        font-size: @default-font-size;
      }
    }
  }
  &.small {
    @padding: 0.3em;
    line-height: @small-tag-line-height;
    font-size: @smallest-font-size;
    padding: 0 @padding;
    .close {
      margin-left: @padding / 2;
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
    .color(fade(@theme-color, 56), @font-color-light);
  }
}
</style>
