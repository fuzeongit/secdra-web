<template>
  <section>
    <div class="page">
      <div class="user-background cover" :style="{backgroundPosition: `center ${scrollTop*.5}px`}">
      </div>
      <div style="margin-top: 3000px">
        {{res}}
      </div>
      <div>
        {{res}}
      </div>
      <div>
        {{res}}
      </div>
      <div>
        {{res}}
      </div>
    </div>
  </section>
</template>

<script>

  import config from "../../assets/js/config";

  export default {
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "user";
      let res = await $axios.get(`${config.host}/user/getSelfInfo`);
      return {res: res.data}
    },
    data() {
      return {}
    },
    computed: {
      scrollTop: {
        get() {
          return this.$store.state.window.scrollTop || 0
        },
        set(val) {
          this.$store.state.window.scrollTop = val || 0
        }
      }
    },
    mounted() {

    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";

  .user-background {
    width: 100%;
    margin-top: -@herder-height;
    background-image: url("../../assets/image/bk/login-bk.jpg");
  }
  @media only screen and (min-width: 1529px) {
    .user-background {
      height: 520px;
    }
  }
  @media only screen and (min-width: 1528px) and (max-width: 1276px){
    .user-background {
      height: 500px;
    }
  }
  @media screen and (min-width: 1275px){
    .user-background {
      height: 480px;
    }
  }
</style>
