<template>
  <nuxt-link
    v-if="to"
    v-ripple
    :to="to"
    class="btn"
    :class="classObject"
    :target="target"
    @click="_click"
  >
    <div class="content">
      <slot></slot>
    </div>
  </nuxt-link>
  <label
    v-else-if="!to && type === `file`"
    v-ripple
    class="btn"
    :class="classObject"
    @click="_click"
  >
    <div class="content">
      <input type="file" @change="_change" />
      <slot></slot>
    </div>
  </label>
  <button
    v-else
    v-ripple
    class="btn"
    :class="classObject"
    :disabled="disabled"
    :type="type"
    @click="_click"
  >
    <div class="content">
      <slot></slot>
    </div>
  </button>
</template>
<script>
export default {
  componentName: "Btn",
  props: {
    to: {
      type: String,
      default: ""
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
    icon: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    outline: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    shadow: {
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
      default: "button",
      validator: (value) =>
        ["button", "submit", "reset", "file"].includes(value)
    },
    target: {
      type: String,
      default: "_self"
    }
  },
  computed: {
    classObject() {
      const classObject = {}
      classObject[this.color + "-color"] = true
      classObject.small = this.small
      classObject.big = this.big
      classObject.icon = this.icon
      classObject.flat = this.flat
      classObject.outline = this.outline
      classObject.round = this.round
      classObject.shadow = this.shadow
      classObject.block = this.block
      classObject.disabled = this.disabled
      return classObject
    }
  },
  methods: {
    _click(e) {
      this.$emit("click", e)
    },
    _change(e) {
      this.$emit("change", e)
    }
  }
}
</script>
