<template>
  <label  class="radio" :class="{active:model,disabled:disabled}">
    <slot>
      <span class="radio-inner"></span>
    </slot>
    <span class="radio-label" v-if="label!==null">{{label}}</span>
    <input type="radio" class="radio-original" :disabled="disabled" v-model="model" :value="true">
  </label>
</template>

<script>
  export default {
    componentName: "Radio",
    props: {
      input: {},
      label: {
        type: String | Number,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      },
      //如果value是Object的话valueKey必填
      value: {
        type: String | Number | Object
      },
      valueKey: String | Number
    },
    model: {
      prop: "input",
      eventL: "input"
    },
    data() {
      return {
        radioGroup: {},
        selfModel: this.input,
      }
    },
    computed: {
      model: {
        get() {
          if (this.isGroup) {
            if (typeof this.value === "object") {
              return this.radioGroup.exist(this.value, this.valueKey)
            } else {
              return this.radioGroup.exist(this.value)
            }
          } else {
            if (typeof this.value === "object") {
              return this.input[this.valueKey] === this.value[this.valueKey]
            } else {
              return this.input === this.value
            }
          }
        },
        set(val) {
          if (this.isGroup) {
            this.radioGroup.change(this.value)
          } else {
            this.$emit("input", this.value)
          }
        }
      },
      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'RadioGroup') {
            parent = parent.$parent;
          } else {
            this.radioGroup = parent;
            return true;
          }
        }
        return false;
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";


  .radio {
    display: inline-block;
    cursor: pointer;
    vertical-align: baseline;
    user-select: none;
    .radio-inner {
      display: inline-block;
      width: @default-font-size;
      height: @default-font-size;
      border-radius: 50%;
      border: 1px solid @box-border-color;
      background-color: @white;
      transition: .1s;
      font-size: @small-font-size;
      vertical-align: middle;
    }
    .radio-label {
      display: inline-block;
      font-size: @default-font-size;
      transition: .1s;
    }
    .radio-original {
      display: none;
    }

    &:hover {
      .radio-inner {
        border-color: @theme-color;
      }
    }

    &.active {
      .radio-inner {
        border:5px solid @theme-color;
      }
      .radio-label {
        color: @theme-color
      }
    }

    &.disabled {
      cursor: not-allowed;
      .radio-inner {
        border-color: @box-border-color;
        background-color: @box-disabled-color;
      }
      .radio-label {
        color: @box-border-color
      }
    }
  }


</style>
