<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    componentName: "CheckboxGroup",
    props: {
      input: {
        type: Array,
        default: []
      }
    },
    model: {
      prop: "input",
      event: "input"
    },
    data() {
      return {model: this.input}
    },
    methods: {
      getIndex(value, valueKey) {
        if (valueKey) {
          return this.model.map(item => item[valueKey]).indexOf(value[valueKey])
        } else {
          return this.model.indexOf(value)
        }
      },
      getNewModel(value, valueKey) {
        let index = this.getIndex(value, valueKey);
        if (index !== -1) {
          this.model.removeIndex(index)
        } else {
          this.model.push(value)
        }
        this.$emit("input", this.model);
      }
    }
  }
</script>
