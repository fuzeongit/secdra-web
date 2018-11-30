<template>
  <transition name="fade" enter-active-class="fadeIn mask-duration" leave-active-class="fadeOut mask-duration" >
    <div class="mask " v-show="visible">
      <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
        <div class="card" v-show="visible">
          <h3>
            {{title}}
          </h3>
          <p>
            {{message}}
          </p>
          <div class="confirm-btn-group">
            <button class="btn is-plain" @click.stop="no">
              {{noDesc}}
            </button>
            <button class="btn" @click.stop="ok">
              {{okDesc}}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
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
        okDesc: `确定`,
        noDesc: `取消`,
        okCallback: function () {
        },
        noCallback: function () {
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
      ok() {
        this.closed = true;
        this.okCallback && this.okCallback(this)
      },
      no() {
        this.closed = true;
        this.noCallback && this.noCallback(this)
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
    .confirm-btn-group {
      margin-top: 10px;
      text-align: right;
    }
  }
</style>
