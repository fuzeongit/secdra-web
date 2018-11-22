<template>
  <div class="page">

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
      let res = {};
      if(store.state.user.user.id===route.params.id){
        res = await $axios.get(`${config.host}/user/getSelfInfo`);
      }else{
        res = await $axios.get(`${config.host}/user/getInfo`,{
          params:{
            userId:route.params.id
          }
        });
      }
      let rusult = res.data;
      let user = rusult.data;
      let isSelf = false;
      if(store.state.user.user.id === user.id){
        store.state.menu.name = "user";
        store.state.user.user = user;
        isSelf = true;
      }else{
        store.state.menu.name = "";
      }
      return {user,isSelf}
    },
    data() {
      return {}
    },
    components:{
      SelfHome,
      OtherHome
    },
    computed: {
      scrollTop(){
        return this.$store.state.window.scrollTop || 0
      }
    },
    mounted(){
    }
  }
</script>

<style type="text/less" lang="less" scoped>

</style>
