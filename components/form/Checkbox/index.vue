<template>
  <label>
  <span>
  <span class="checkbox-inner"></span>
  <input type="checkbox" class="checkbox-original" :disabled="disabled" v-model="model">
  </span>
    <span class="checkbox-label">{{label}}</span>
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
            this.checkboxGroup.getNewModel(this.value,this.valueKey)
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

<style scoped>

</style>
