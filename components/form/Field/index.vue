<template>
  <label class="input" :class="classObject">
    <textarea
      v-if="type === `textarea`"
      v-model="normalizedInput"
      class="input-inner"
      :rows="rows"
      :title="title"
      :disabled="disabled"
      :placeholder="placeholder"
      :readonly="readonly"
      @change="_change"
    ></textarea>
    <input
      v-else
      v-model="normalizedInput"
      class="input-inner"
      :type="type"
      :title="title"
      :disabled="disabled"
      :placeholder="placeholder"
      :readonly="readonly"
      @change="_change"
    />
  </label>
</template>

<script>
export default {
  componentName: "Field",
  model: {
    prop: "input",
    event: "input"
  },
  props: {
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
    type: {
      type: String,
      default: "text",
      validator: (value) => ["text", "password", "textarea"].includes(value)
    },
    rows: {
      type: Number,
      default: 3
    },
    input: {
      type: String | Number,
      default: ""
    },
    title: {
      type: String | Number,
      default: ""
    },
    placeholder: {
      type: String | Number,
      default: ""
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    normalizedInput: {
      get() {
        return this.input
      },
      set(val) {
        this.$emit("input", val)
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
      classObject.textarea = this.type === "textarea"
      return classObject
    }
  },
  methods: {
    _change(e) {
      this.$emit(`change`, e)
    }
  }
}
</script>
