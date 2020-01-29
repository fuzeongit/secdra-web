<template>
  <div class="input" :class="classObject">
    <div class="tag-list">
      <template v-for="(item, index) in normalizedTagList">
        <Tag
          :key="index"
          :content="item"
          :color="color"
          :value="index"
          :small="small"
          :big="big"
          :closable="!disabled && !readonly"
          @close="_remove(index)"
        ></Tag
        >{{ " " }}
      </template>
    </div>
    <div class="input-div">
      <input
        v-model="normalizedInput"
        class="input-inner"
        type="text"
        :disabled="disabled"
        :placeholder="placeholder"
        :readonly="readonly"
        autocomplete="on"
        @change="_add"
        @focus="focus = true"
        @blur="focus = false"
      />
      <div
        v-if="max"
        class="tips"
        :class="{ full: normalizedTagList.length === max }"
      >
        ({{ normalizedTagList.length }}/{{ max }})
      </div>
    </div>
  </div>
</template>

<script>
export default {
  componentName: "TagInput",
  model: {
    prop: "tagList",
    event: "change"
  },
  props: {
    tagList: {
      type: Array,
      default: () => []
    },
    max: {
      type: Number,
      default: 0
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
    },
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    input: {
      type: String | Number,
      default: ""
    },
    placeholder: {
      type: String | Number,
      default: "点击回车添加一个标签"
    },
    shadow: {
      type: Boolean,
      default: false
    },
    notLine: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      normalizedInput: this.input,
      focus: false
    }
  },
  computed: {
    normalizedTagList: {
      get() {
        return this.tagList
      },
      set(val) {
        this.$emit("change", val)
        return val
      }
    },
    classObject() {
      const classObject = {}
      classObject[this.color + "-color"] = true
      classObject.small = this.small
      classObject.big = this.big
      classObject.block = this.block
      classObject.disabled = this.disabled
      classObject.shadow = this.shadow
      classObject["not-line"] = this.notLine
      classObject["input-focus"] = this.focus
      return classObject
    }
  },
  methods: {
    _add() {
      if (this.max && this.max === this.normalizedTagList.length) {
        return
      }
      const _tagList = this.normalizedTagList.clone()
      _tagList.push(this.normalizedInput)
      this.normalizedInput = ""
      this.$emit(`change`, _tagList)
    },
    _remove(index) {
      const _tagList = this.normalizedTagList.clone()
      _tagList.removeIndex(index)
      this.$emit(`change`, _tagList)
    }
  }
}
</script>
<style scoped lang="less" type="text/less">
@import "../../../assets/style/color";
@import "../../../assets/style/config";
@import "../../../assets/style/mixin";
.input {
  display: block;
  height: auto;
  white-space: inherit !important;
  padding: 0 @input-padding;
  .tag-list {
    line-height: @tag-line-height;
    width: 100%;
    .tag {
      margin-top: @input-padding / 2;
    }
  }
  .input-div {
    width: 100%;
    display: flex;
    align-items: center;
    .tips {
      margin-left: 0.5em;
      text-align: right;
      &.full {
        color: red;
      }
    }
  }
  .input-inner {
    flex: 1;
    height: @input-line-height;
  }
  &.big {
    .tag-list {
      .tag {
        margin-top: @big-input-padding / 2;
      }
    }
    .input-inner {
      width: 100%;
      height: @big-input-line-height;
    }
  }
  &.small {
    .tag-list {
      .tag {
        margin-top: @small-input-padding / 2;
      }
    }
    .input-inner {
      width: 100%;
      height: @small-input-line-height;
    }
  }
}
</style>
