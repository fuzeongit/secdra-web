<template>
  <div>
    <div class="user-bk cover" :style="{backgroundPosition: `center ${scrollTop*.5}px`,backgroundImage: `url(${$img.back(user.background,`imageMogr2/thumbnail/1920x/gravity/Center/crop/1920x640/blur/1x0/quality/75|imageslim`,true)})`}">
      <div class="user-bk-content"></div>
    </div>
    <div class="content card" :style="{marginTop:`${-scrollTop*.1-50}px`}">
      <div class="head-box">
        <a>
          <img :src="$img.head(user.head)"
               :onerror="`this.src='${require('../../../assets/image/default/default-head.jpg')}'`">
        </a>
      </div>
      <div style="margin-top: 3000px">

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      user() {
        return this.$store.state.user.user || {}
      },
      scrollTop: {
        get() {
          return this.$store.state.window.scrollTop || 0
        },
        set(val) {
          this.$store.state.window.scrollTop = val || 0
        }
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";

  .user-bk {
    width: 100%;
    margin-top: -@herder-height;
    /*background-image: url("../../../assets/image/bk/login-bk.jpg");*/
    .user-bk-content {
      padding-top: @herder-height;
      width: 100%;
      height: 100%;
    }
  }

  @media only screen and (min-width: 1529px) {
    .user-bk {
      height: 520px;
    }
  }

  @media only screen and (min-width: 1528px) and (max-width: 1276px) {
    .user-bk {
      height: 500px;
    }
  }

  @media screen and (min-width: 0) {
    .user-bk {
      height: 480px;
    }
  }

  .content {
    width: @visual-width;
    margin: 0 auto;
    @head-img-height: 150px;
    @head-img-border: 2px;
    .head-box {
      padding: 0 100px 20px;
      img{
        transform: translateY(-(@head-img-height+@head-img-border)/2);
        height: @head-img-height;
        width: @head-img-height;
        border: @head-img-border solid @white;
        border-radius: 50%;
      }
    }
  }
</style>
