<template>
  <!--<component :is="to?`nuxt-link`:`button`" class="btn" @click.stop="_click"-->
             <!--:class="classObject" v-ripple :disabled="disabled" :to="to" type="to?type">-->
    <!--<div class="content">-->
      <!--<slot></slot>-->
    <!--</div>-->
  <!--</component>-->
  <nuxt-link v-if="to" :to="to" class="btn"
             :class="classObject" v-ripple @click.stop="_click">
    <div class="content">
      <slot></slot>
    </div>
  </nuxt-link>
  <button v-else class="btn"
             :class="classObject" v-ripple :disabled="disabled" :type="type" @click.stop="_click">
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
      }
    },
    computed: {
      classObject() {
        let classObject = {};
        classObject[this.color + "-color"] = true;
        classObject["small"] = this.small;
        classObject["icon"] = this.icon;
        classObject["flat"] = this.flat;
        classObject["outline"] = this.outline;
        classObject["round"] = this.round;
        classObject["block"] = this.block;
        classObject["disabled"] = this.disabled;
        return classObject
      }
    },
    methods:{
      _click(e){
        this.$emit("click",e)
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";

</style>
