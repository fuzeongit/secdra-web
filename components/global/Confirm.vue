<template>
  <div class="mask" >
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <div class="card alert" v-show="visible">
        <h2></h2>
        <p>
          {{message}}
        </p>
        <button class="btn-blue" @click.stop="close">
          {{btnDesc}}
        </button>
        <button class="btn-blue" @click.stop="close">
          {{btnDesc}}
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "Confirm",
    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.firstElementChild.addEventListener('transitionend', this.destroyElement);
          this.$el.firstElementChild.addEventListener('animationend', this.destroyElement);
        }
      }
    },
    data() {
      return {
        visible: false,
        closed: false,
        okDesc:`确定`,
        noDesc:`取消`,
      }
    },
    methods: {
      destroyElement() {
        this.$el.firstElementChild.removeEventListener('transitionend', this.destroyElement);
        this.$el.firstElementChild.removeEventListener('animationend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },
      close() {
        this.closed = true;
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  .alert{
    width: 450px;
    margin: 0 auto;
    vertical-align: middle;
    display: inline-block;
  }
</style>
