<template>
  <label class="input" :class="classObject">
    <textarea v-if="type===`textarea`" class="input-inner" :rows="rows" :title="title" :disabled="disabled"
              v-model="normalizedInput" @change="_change" :placeholder="placeholder" :readonly="readonly"></textarea>
    <input v-else class="input-inner" :type="type" :title="title" :disabled="disabled" v-model="normalizedInput"
           @change="_change" :placeholder="placeholder" :readonly="readonly">
  </label>
</template>

<script>
  export default {
    componentName: "Field",
    props: {
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
        validator: value => ['text', 'password', 'textarea'].indexOf(value) > -1
      },
      rows: {
        type: Number,
        default: 3
      },
      input: {},
      title: {},
      placeholder: {
        default: ""
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    model: {
      prop: "input",
      event: "input"
    },
    computed: {
      normalizedInput: {
        get() {
          return this.input
        },
        set(val) {
          this.$emit("input", val);
          return val
        }
      },
      classObject() {
        let classObject = {};
        classObject[this.color + "-color"] = true;
        classObject["small"] = this.small;
        classObject["big"] = this.big;
        classObject["block"] = this.block;
        classObject["disabled"] = this.disabled;
        classObject["textarea"] = this.type === 'textarea';
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
