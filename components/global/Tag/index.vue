<template>
  <span v-ripple="clickable" class="tag" :class="classObject" @click="_click">
    <div class="content ellipsis">
      {{ content }}
    </div>
    <Btn
      v-if="closable"
      flat
      icon
      :color="color"
      class="close"
      @click.stop="close"
      @mousedown.native.stop="() => {}"
    >
      <i class="icon ali-icon-close"></i>
    </Btn>
  </span>
</template>

<script>
export default {
  componentName: "Tag",
  props: {
    content: {
      type: String,
      default: ""
    },
    value: {
      type: Object | String | Number | Array,
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
    round: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classObject() {
      const classObject = {}
      classObject[this.color + "-color"] = true
      classObject.small = this.small
      classObject.big = this.big
      classObject.round = this.round
      classObject.shadow = this.shadow
      classObject.clickable = this.clickable
      return classObject
    }
  },
  methods: {
    _click(e) {
      this.$emit("click", e)
    },
    close() {
      this.$emit("close", { content: this.content, value: this.value })
    }
  }
}
</script>

<style scoped lang="less" type="text/less"></style>
