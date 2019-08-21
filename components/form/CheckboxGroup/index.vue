<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName: "CheckboxGroup",
  model: {
    prop: "input",
    event: "input"
  },
  props: {
    input: {
      type: Array,
      default: () => []
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
    getIndex(value, valueKey) {
      if (valueKey) {
        return this.model.map((item) => item[valueKey]).indexOf(value[valueKey])
      } else {
        return this.model.indexOf(value)
      }
    },
    getNewModel(value, valueKey) {
      const index = this.getIndex(value, valueKey)
      if (index !== -1) {
        this.model.removeIndex(index)
      } else {
        this.model.push(value)
      }
      this.$emit("input", this.model)
    }
  }
}
</script>
