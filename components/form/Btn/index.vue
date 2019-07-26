<template>
  <nuxt-link v-if="to" :to="to" class="btn"
             :class="classObject" v-ripple @click="_click" :target="target">
    <div class="content">
      <slot></slot>
    </div>
  </nuxt-link>
  <label v-else-if="!to&&type===`file`" class="btn"
         :class="classObject" v-ripple @clickx="_click">
    <div class="content">
      <input type="file" @change="_change">
      <slot></slot>
    </div>
  </label>
  <button v-else class="btn"
          :class="classObject" v-ripple :disabled="disabled" :type="type" @click="_click">
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
        default: 'default'
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
        default: "button"
      },
      target: {
        type: String,
        default: "_self"
      }
    },
    computed: {
      classObject() {
        let classObject = {};
        classObject[this.color + "-color"] = true;
        classObject["small"] = this.small;
        classObject["big"] = this.big;
        classObject["icon"] = this.icon;
        classObject["flat"] = this.flat;
        classObject["outline"] = this.outline;
        classObject["round"] = this.round;
        classObject["shadow"] = this.shadow;
        classObject["block"] = this.block;
        classObject["disabled"] = this.disabled;
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
