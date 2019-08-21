<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName: "RadioGroup",
  model: {
    prop: "input",
    event: "input"
  },
  props: {
    input: {
      type: String | Number | Object | Boolean,
      default: null
    }
  },
  data() {
    return { model: this.input }
  },
  watch: {
    input: {
      handler(val) {
        this.model = val
      },
      deep: true
    }
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
      this.model = value
      this.$emit("input", this.model)
    }
  }
}
</script>
