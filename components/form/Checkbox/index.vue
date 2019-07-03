<template>
  <label class="checkbox" :class="classObject">
    <slot>
      <div class="checkbox-inner" v-ripple="{class:`${color}-text`}" :class="{'dark-fade-text':!model}">
        <div class="content">
          <i class="icon" :class="{'s-checkboxoutlineblank':!model,'s-check-box':model}"></i>
        </div>
      </div>
    </slot>
    <span class="checkbox-label" v-if="label!==null" :class="{'dark-text':!model}">{{label}}</span>
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
      color: {
        type: String,
        default: 'default'
      },
      small: {
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
      },
      classObject() {
        let classObject = {};
        classObject[this.color + "-color"] = true;
        classObject["small"] = this.small;
        classObject["disabled"] = this.disabled;
        return classObject
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
</style>
