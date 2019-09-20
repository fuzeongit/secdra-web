<template>
  <div class="input" :class="classObject">
    <div class="placeholder">
      <slot name="left"></slot>
    </div>
    <textarea
      v-if="type === `textarea`"
      v-model="normalizedInput"
      class="input-inner"
      :rows="rows"
      :disabled="disabled"
      :placeholder="placeholder"
      :readonly="readonly"
      @change="_change"
      @focus="focus = true"
      @blur="focus = false"
    ></textarea>
    <input
      v-else
      v-model="normalizedInput"
      class="input-inner"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      :readonly="readonly"
      autocomplete="on"
      @change="_change"
      @focus="focus = true"
      @blur="focus = false"
    />
    <div class="placeholder">
      <slot name="right"></slot>
    </div>
  </div>
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
      validator: (value) =>
        ["text", "password", "search", "textarea"].includes(value)
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
    shadow: {
      type: Boolean,
      default: false
    },
    notLine: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      focus: false
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
      classObject.shadow = this.shadow
      classObject["not-line"] = this.notLine
      classObject.textarea = this.type === "textarea"
      classObject["input-focus"] = this.focus
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
