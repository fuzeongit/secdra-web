<template>
  <Popper trigger="click" placement="bottom-start" ref="popper">
    <DatePicker v-model="normalizedDate" v-if="!disabled" :type="type" :format="format"></DatePicker>
    <input class="input" slot="reference" v-model="normalizedDate" readonly :class="classObject">
  </Popper>
</template>

<script>
  export default {
    props: {
      date: {
        default: () => new Date()
      },
      format: {
        type: String,
        default: "YYYY-MM-DD",
      },
      type: {
        type: String,
        default: 'day',
        validator: value => ['year', 'month', 'day'].indexOf(value) > -1
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
      block: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    model: {
      prop: "date",
      event: "change"
    },
    computed: {
      normalizedDate: {
        get() {
          return this.format ? this.$filter.date(new Date(this.date), this.format) : new Date(this.date)
        },
        set(val) {
          this.$refs['popper'].doClose();
          this.$emit("change", val);
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
        return classObject
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>

</style>
