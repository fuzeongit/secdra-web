<template>
  <label class="radio" :class="classObject">
    <slot>
      <div class="radio-inner" v-ripple="{class:`${color}-text`}" :class="{'dark-fade-text':!model}">
         <div class="content">
          <i class="icon" :class="{'s-md-radio-button-off':!model,'s-md-radio-button-on':model}"></i>
        </div>
      </div>
    </slot>
    <span class="radio-label" v-if="label!==null" :class="{'dark-text':!model}">{{label}}</span>
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
      color: {
        type: String,
        default: 'default'
      },
      small: {
        type: Boolean,
        default: false
      },
      //如果value是Object的话valueKey必填
      value: {},
      valueKey: String | Number
    },
    model: {
      prop: "input",
      event: "input"
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
