<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    componentName: "RadioGroup",
    props: {
      input: {}
    },
    model: {
      prop: "input",
      event: "input"
    },
    data() {
      return {model: this.input}
    },
    methods: {
      exist(value, valueKey) {
        if (valueKey) {
          return this.model[valueKey] === value[valueKey]
        } else {
          return this.model === value
        }
      },
      change(value) {
        this.model = value;
        this.$emit("input", this.model);
      }
    }
  }
</script>

