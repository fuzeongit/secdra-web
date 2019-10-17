<template>
  <Popper ref="popper" trigger="click" placement="bottom-start">
    <DatePicker
      v-if="!disabled"
      v-model="normalizedDate"
      :type="type"
      :format="format"
      :max="max"
      :min="min"
    ></DatePicker>
    <template #reference>
      <Field
        v-model="normalizedDate"
        :color="color"
        :small="small"
        :big="big"
        :block="block"
        :disabled="disabled"
        :placeholder="placeholder"
        readonly
      ></Field>
    </template>
  </Popper>
</template>

<script>
export default {
  model: {
    prop: "date",
    event: "change"
  },
  props: {
    date: {
      type: String | Number | Object,
      default: () => new Date()
    },
    format: {
      type: String,
      default: "YYYY-MM-DD"
    },
    type: {
      type: String,
      default: "day",
      validator: (value) => ["year", "month", "day"].includes(value)
    },
    min: {
      type: String | Number | Object | null,
      default: null
    },
    max: {
      type: String | Number | Object | null,
      default: null
    },
    color: {
      type: String,
      default: "default"
    },
    small: {
      type: Boolean,
      default: false
    },
    big: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String | Number,
      default: ""
    }
  },
  computed: {
    normalizedDate: {
      get() {
        return this.format
          ? this.$filter.date(new Date(this.date), this.format)
          : new Date(this.date)
      },
      set(val) {
        this.$refs.popper.doClose()
        this.$emit("change", val)
        return val
      }
    },
    classObject() {
      const classObject = {}
      classObject[this.color + "-color"] = true
      classObject.small = this.small
      classObject.big = this.big
      classObject.block = this.block
      classObject.disabled = this.disabled
      return classObject
    }
  }
}
</script>

<style type="text/less" lang="less" scoped></style>
