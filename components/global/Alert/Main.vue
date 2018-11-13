<template>
  <div class="mask">
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <div class="card padding-15" v-show="visible">
        <h3>{{title}}</h3>
        <p>
          {{message}}
        </p>
        <div class="alert-btn-group">
          <button class="btn" @click.stop="close">
            {{btnDesc}}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
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
        title: "提示",
        btnDesc: `确定`,
        callback: () => {
        }
      }
    },
    methods: {
      destroyElement() {
        this.$el.firstElementChild.removeEventListener('transitionend', this.destroyElement);
        this.$el.firstElementChild.removeEventListener('animationend', this.destroyElement);
        this.callback && this.callback();
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
  @import "../../../assets/style/color.less";
  @import "../../../assets/style/config.less";

  .card {
    width: 450px;
    margin: 0 auto;
    vertical-align: middle;
    display: inline-block;
    h3 {
      text-align: left;
      line-height: 40px;
    }
    p {
      text-align: left;
      padding: 10px 0;
      line-height: 25px;
      color: @gray;
    }
    .alert-btn-group {
      margin-top: 10px;
      text-align: right;
    }
  }
</style>
