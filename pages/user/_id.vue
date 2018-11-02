<template>
  <section>
    <Header activeName="user"></Header>
    <div class="page">
    {{res}}
    </div>
  </section>
</template>

<script>
  export default {
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData ({store, req, redirect, route,$axios}) {
      store.state.menu.name = "user";
      let res  = await $axios.get('/api/user/getSelfInfo');
      return {res:res.data}
    },
    // data(){
    //   return {
    //     responses:null
    //   }
    // },
  }
</script>

<style scoped>

</style>
