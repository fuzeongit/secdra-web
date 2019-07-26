<template>
  <div class="page">
    <SelfHome v-if="isSelf"></SelfHome>
    <OtherHome v-else :user="user" @follow="follow"></OtherHome>
    <GoTop></GoTop>
  </div>
</template>

<script>
  import SelfHome from "../../components/pages/user/SelfHome";
  import OtherHome from "../../components/pages/user/OtherHome";
  import GoTop from "../../components/pages/shared/GoTop";
  import {mapActions} from "vuex"

  export default {
    components: {
      SelfHome,
      OtherHome,
      GoTop
    },
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      let selfUser = store.state.user.user;
      let taskList = [];
      taskList.push($axios.get(`/user/getInfo`, {params: {id: route.params.id}}));
      if (selfUser.id === route.params.id) {
        taskList.push($axios.get(`/qiniu/getUploadToken`));
      }
      let resultList = (await Promise.all(taskList)).map(item => item.data);

      if (resultList[0].status !== 200) {
        redirect(`/user/${selfUser.id}`)
      }
      let user = resultList[0].data;
      if (selfUser.id === user.id) {
        store.commit('menu/MChangeName', "user");
        store.commit('user/MSetUserInfo', user);
        store.commit('user/MSetUploadToken', resultList[1].data);
      } else {
        store.commit('menu/MChangeName', "");
      }
      return {
        user
      }
    },
    computed: {
      isSelf() {
        return this.$store.state.user.user.id === this.$route.params.id
      }
    },
    methods: {
      ...mapActions("user", ["AFollow"]),
      async follow() {
        let result = await this.AFollow({
          followingId: this.user.id
        });
        if (result.status !== 200) {
          this.$notify({message: result.message});
          return
        }
        this.user.focus = result.data
      },
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";
</style>
