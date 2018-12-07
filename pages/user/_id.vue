<template>
  <div class="page">
    <SelfHome v-if="isSelf"></SelfHome>
    <OtherHome v-else :user="user"></OtherHome>
    <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration">
      <button class="btn is-suspend" v-goTop style="position: fixed;right: 50px;bottom: 50px;" v-show="scrollTop>150"><i
        class="icon s-zhiding"></i></button>
    </transition>
  </div>
</template>

<script>
  import config from "../../assets/js/config";
  import SelfHome from "../../components/pages/user/SelfHome";
  import OtherHome from "../../components/pages/user/OtherHome";

  export default {
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      let res = await $axios.get(`${config.host}/user/getInfo`, {
        params: {
          id: route.params.id
        }
      });
      let rusult = res.data;
      let user = rusult.data;
      if (rusult.status !== 200) {
        redirect(`/user/${store.state.user.user.id}`)
      }
      if (store.state.user.user.id === user.id) {
        store.state.menu.name = "user";
        store.state.user.user = user;
      } else {
        store.state.menu.name = "";
      }
      return {user}
    },
    data() {
      return {}
    },
    components: {
      SelfHome,
      OtherHome
    },
    computed: {
      isSelf() {
        return this.$store.state.user.user.id === this.$route.params.id
      },
      scrollTop() {
        return this.$store.state.window.scrollTop || 0
      }
    },
    mounted() {
    }
  }
</script>

<style type="text/less" lang="less" scoped>

</style>
