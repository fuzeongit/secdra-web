<template>
  <label>
  <span>
  <span class="radio-inner"></span>
  <input type="radio" class="radio-original" :disabled="disabled" v-model="model" :value="true">
  </span>
    <span class="radio-label">{{label}}</span>
  </label>
</template>

<script>
  export default {
    componentName: "Radio",
    props: {
      input: {},
      label: {
        type: String | Number,
        default: ""
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

<style scoped>

</style>
