<template>
  <label class="checkbox" :class="{active:model,disabled:disabled}">
    <slot>
      <span class="checkbox-inner"><i class="icon s-correct-bold"></i></span>
    </slot>
    <span class="checkbox-label" v-if="label!==null">{{label}}</span>
    <input type="checkbox" class="checkbox-original" :disabled="disabled" v-model="model">
  </label>
</template>

<script>
  export default {
    componentName: "Checkbox",
    props: {
      input: {
        type: Boolean,
        default: false
      },
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
        checkboxGroup: {},
        selfModel: this.input,
      }
    },
    computed: {
      model: {
        get() {
          if (this.isGroup) {
            if (typeof this.value === "object") {
              return this.checkboxGroup.getIndex(this.value, this.valueKey) !== -1
            } else {
              return this.checkboxGroup.getIndex(this.value) !== -1
            }
          }
          return this.selfModel
        },
        set(val) {
          if (this.isGroup) {
            this.checkboxGroup.getNewModel(this.value, this.valueKey)
          } else {
            this.selfModel = val;
            this.$emit("input", val)
          }
        }
      },
      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'CheckboxGroup') {
            parent = parent.$parent;
          } else {
            this.checkboxGroup = parent;
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

  .checkbox {
    display: inline-block;
    vertical-align: baseline;
    cursor: pointer;
    user-select: none;
    .checkbox-inner {
      display: inline-block;
      width: @default-font-size;
      height: @default-font-size;
      border-radius: @smallest-border-radius;
      border: 1px solid @box-border-color;
      background-color: @white;
      transition: .1s;
      font-size: @small-font-size;
      vertical-align: middle;
      .icon {
        font-size: @small-font-size;
        color: @white;
        transition: .1s;
        opacity: 0;
        vertical-align: super;
      }
    }
    .checkbox-label {
      display: inline-block;
      font-size: @default-font-size;
      transition: .1s;
    }
    .checkbox-original {
      display: none;
    }

    &:hover {
      .checkbox-inner {
        border-color: @theme-color;
      }
    }

    &.active {
      .checkbox-inner {
        border-color: @theme-color;
        background-color: @theme-color;
        .icon {
          opacity: 1;
        }
      }
      .checkbox-label {
        color: @theme-color
      }
    }

    &.disabled {
      cursor: not-allowed;
      .checkbox-inner {
        border-color: @box-border-color;
        background-color: @box-disabled-color;
        .icon {
          color: @box-border-color;
        }
      }
      .checkbox-label {
        color: @box-border-color
      }
    }
  }


</style>
