<template>
  <transition name="fade" enter-active-class="fadeIn mask-duration" leave-active-class="fadeOut mask-duration">
    <div class="mask" v-show="visible">
      <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
        <div class="card" v-show="visible">
          <h3>{{title}}</h3>
          <p>
            {{message}}
          </p>
          <div class="btn-group">
            <Btn flat color="primary" @click="close">
              {{btnDesc}}
            </Btn>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  export default {
    componentName: "Alert",
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
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },
      close() {
        this.closed = true;
        this.callback && this.callback(this);
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";

  .card {
    width: 450px;
    margin: 0 auto;
    vertical-align: middle;
    display: inline-block;
    padding: 15px;
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
    .btn-group {
      margin-top: 10px;
      text-align: right;
    }
  }
</style>
